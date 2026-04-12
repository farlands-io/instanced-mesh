import { sortOpaque, sortTransparent } from "../../utils/SortingUtils.js";
import { Sector } from "../InstancedEntity.js";
import { InstancedMesh2 } from "../InstancedMesh2.js";
import { InstancedRenderItem, InstancedRenderList } from "../utils/InstancedRenderList.js";
import { LODLevel, LODRenderList } from "./LOD.js";
import { BVHNode } from "bvh.js";
import { Camera, Frustum, Material, Matrix4, Sphere, Vector3 } from "three";

// TODO: fix shadowMap LOD sorting objects?

/**
 * A custom sorting callback for render items.
 */
export type CustomSortCallback = (list: InstancedRenderItem[]) => void;

/**
 * Callback invoked when an instance is within the frustum.
 * @param index The index of the instance.
 * @param camera The camera used for rendering.
 * @param cameraLOD The camera used for LOD calculations (provided only if LODs are initialized).
 * @param LODindex The LOD level of the instance (provided only if LODs are initialized and `sortObjects` is false).
 * @returns True if the instance should be rendered, false otherwise.
 */
export type OnFrustumEnterCallback = (index: number, camera: Camera, cameraLOD?: Camera, LODindex?: number) => boolean;

/** @internal Reusable state for BVH culling callback to avoid closure allocation */
interface BVHCullingState {
  array: Uint32Array;
  instancesArrayCount: number;
  sortObjects: boolean;
  onFrustumEnter: OnFrustumEnterCallback;
  camera: Camera;
  count: number;
  mesh: InstancedMesh2;
}

const _bvhCullingState: BVHCullingState = {
  array: null,
  instancesArrayCount: 0,
  sortObjects: false,
  onFrustumEnter: null,
  camera: null,
  count: 0,
  mesh: null,
};

function _bvhCullingCallback(node: BVHNode<{}, number>) {
  const s = _bvhCullingState;
  const index = node.object;

  if (
    index < s.instancesArrayCount &&
    s.mesh.getVisibilityAt(index) &&
    (!s.onFrustumEnter || s.onFrustumEnter(index, s.camera))
  ) {
    if (s.sortObjects) {
      s.mesh.getPositionAt(index, _position);
      if (s.mesh._hasSectors) {
        s.mesh.getSectorOffsetFor(index, _sectorOffset);
        _position.add(_sectorOffset);
      }
      const depth = _position.sub(_cameraPos).dot(_forward);
      _renderList.push(depth, index);
    } else {
      s.array[s.count++] = index;
    }
  }
}

/** @internal Reusable state for BVHCullingLOD sort path to avoid closure allocation */
interface BVHCullingLODSortState {
  instancesArrayCount: number;
  onFrustumEnter: OnFrustumEnterCallback;
  camera: Camera;
  cameraLOD: Camera;
  mesh: InstancedMesh2;
}

const _bvhCullingLODSortState: BVHCullingLODSortState = {
  instancesArrayCount: 0,
  onFrustumEnter: null,
  camera: null,
  cameraLOD: null,
  mesh: null,
};

function _bvhCullingLODSortCallback(node: BVHNode<{}, number>) {
  const s = _bvhCullingLODSortState;
  const index = node.object;

  if (
    index < s.instancesArrayCount &&
    s.mesh.getVisibilityAt(index) &&
    (!s.onFrustumEnter || s.onFrustumEnter(index, s.camera, s.cameraLOD))
  ) {
    s.mesh.getPositionAt(index, _position);
    if (s.mesh._hasSectors) {
      s.mesh.getSectorOffsetFor(index, _sectorOffset);
      _position.add(_sectorOffset);
    }
    const distance = _position.distanceToSquared(_cameraLODPos);
    _renderList.push(distance, index);
  }
}

/** @internal Reusable state for BVHCullingLOD non-sort path to avoid closure allocation */
interface BVHCullingLODState {
  instancesArrayCount: number;
  onFrustumEnter: OnFrustumEnterCallback;
  camera: Camera;
  cameraLOD: Camera;
  mesh: InstancedMesh2;
  indexes: Uint32Array[];
  count: number[];
  levels: LODLevel[];
}

const _bvhCullingLODState: BVHCullingLODState = {
  instancesArrayCount: 0,
  onFrustumEnter: null,
  camera: null,
  cameraLOD: null,
  mesh: null,
  indexes: null,
  count: null,
  levels: null,
};

function _bvhCullingLODCallback(node: BVHNode<{}, number>, level: number) {
  const s = _bvhCullingLODState;
  const index = node.object;

  if (index < s.instancesArrayCount && s.mesh.getVisibilityAt(index)) {
    if (level === null) {
      s.mesh.getPositionAt(index, _position);
      if (s.mesh._hasSectors) {
        s.mesh.getSectorOffsetFor(index, _sectorOffset);
        _position.add(_sectorOffset);
      }
      const distance = _position.distanceToSquared(_cameraLODPos);
      level = s.mesh.getObjectLODIndexForDistance(s.levels, distance);
    }

    if (!s.onFrustumEnter || s.onFrustumEnter(index, s.camera, s.cameraLOD, level)) {
      s.indexes[level][s.count[level]++] = index;
    }
  }
}

declare module "../InstancedMesh2.js" {
  interface InstancedMesh2 {
    /**
     * Performs frustum culling and manages LOD visibility.
     * @param camera The main camera used for rendering.
     * @param cameraLOD An optional camera for LOD calculations. Defaults to the main camera.
     */
    performFrustumCulling(camera: Camera, cameraLOD?: Camera): void;

    /** @internal */ getSectorAwarePosition(instanceId: number, target: Vector3): Vector3;
    /** @internal */ getSectorOffsetFor(instanceId: number, target: Vector3): Vector3;
    /** @internal */ updateLastRenderInfo(frame: number, camera: Camera, shadowCamera: Camera | null): void;
    /** @internal */ frustumCullingAlreadyPerformed(
      frame: number,
      camera: Camera,
      shadowCamera: Camera | null,
    ): boolean;
    /** @internal */ frustumCulling(camera: Camera): void;
    /** @internal */ updateIndexArray(): void;
    /** @internal */ updateRenderList(): void;
    /** @internal */ BVHCulling(camera: Camera): void;
    /** @internal */ linearCulling(camera: Camera): void;

    /** @internal */ frustumCullingLOD(LODrenderList: LODRenderList, camera: Camera, cameraLOD: Camera): void;
    /** @internal */ BVHCullingLOD(
      LODrenderList: LODRenderList,
      indexes: Uint32Array[],
      sortObjects: boolean,
      camera: Camera,
      cameraLOD: Camera,
    ): void;
    /** @internal */ linearCullingLOD(
      LODrenderList: LODRenderList,
      indexes: Uint32Array[],
      sortObjects: boolean,
      camera: Camera,
      cameraLOD: Camera,
    ): void;
  }
}

const _frustum = new Frustum();
const _renderList = new InstancedRenderList();
const _projScreenMatrix = new Matrix4();
const _invMatrixWorld = new Matrix4();
const _forward = new Vector3();
const _cameraPos = new Vector3();
const _cameraLODPos = new Vector3();
const _position = new Vector3();
const _sphere = new Sphere();
const _sector = new Sector();
const _sectorOffset = new Vector3();
const _bvhTranslation = new Matrix4();
const SECTOR_SCALE = 128; // Sector to world space conversion
const _lodIndexes: Uint32Array[] = []; // Reusable array for LOD indexes

InstancedMesh2.prototype.getSectorAwarePosition = function (instanceId: number, target: Vector3): Vector3 {
  // Get local position
  this.getPositionAt(instanceId, target);

  // Always apply sector offset (required for floating origin)
  if (!this._hasSectors || !this._globalTrackedSectorLow || !this._globalTrackedSectorHigh) {
    return target; // No sector texture available
  }

  // Get instance sector from texture
  this.getSectorAt(instanceId, _sector);

  // Calculate sector delta (instance - tracked)
  const deltaLowX = Number(_sector.x & 0xffffffffn) - this._globalTrackedSectorLow.x;
  const deltaLowY = Number(_sector.y & 0xffffffffn) - this._globalTrackedSectorLow.y;
  const deltaLowZ = Number(_sector.z & 0xffffffffn) - this._globalTrackedSectorLow.z;

  const deltaHighX = Number(_sector.x >> 32n) - this._globalTrackedSectorHigh.x;
  const deltaHighY = Number(_sector.y >> 32n) - this._globalTrackedSectorHigh.y;
  const deltaHighZ = Number(_sector.z >> 32n) - this._globalTrackedSectorHigh.z;

  // Reconstruct 64-bit delta (matches GPU shader logic)
  const offsetX = (deltaLowX + deltaHighX * 4294967296) * SECTOR_SCALE;
  const offsetY = (deltaLowY + deltaHighY * 4294967296) * SECTOR_SCALE;
  const offsetZ = (deltaLowZ + deltaHighZ * 4294967296) * SECTOR_SCALE;

  // Apply sector offset and world offset (matches getSectorOffset() shader)
  const worldOffset = this._globalWorldOffset ?? { x: 0, y: 0, z: 0 };
  target.x += offsetX - worldOffset.x;
  target.y += offsetY - worldOffset.y;
  target.z += offsetZ - worldOffset.z;

  return target;
};

InstancedMesh2.prototype.getSectorOffsetFor = function (instanceId: number, target: Vector3): Vector3 {
  target.set(0, 0, 0);
  if (!this._hasSectors || !this._globalTrackedSectorLow) return target;

  this.getSectorAt(instanceId, _sector);
  const low = this._globalTrackedSectorLow;
  const sectorLowX = Number(_sector.x & 0xffffffffn);
  const sectorLowY = Number(_sector.y & 0xffffffffn);
  const sectorLowZ = Number(_sector.z & 0xffffffffn);
  // Use simple int32-style subtraction (matches shader)
  const dx = ((sectorLowX - low.x) | 0);
  const dy = ((sectorLowY - low.y) | 0);
  const dz = ((sectorLowZ - low.z) | 0);

  const wo = this._globalWorldOffset;
  target.x = dx * SECTOR_SCALE - (wo?.x ?? 0);
  target.y = dy * SECTOR_SCALE - (wo?.y ?? 0);
  target.z = dz * SECTOR_SCALE - (wo?.z ?? 0);
  return target;
};

InstancedMesh2.prototype.performFrustumCulling = function (camera: Camera, cameraLOD = camera) {
  const mainMesh = this._parentLOD ?? this;
  const LODinfo = mainMesh.LODinfo;
  let LODrenderList: LODRenderList;

  if (LODinfo) {
    const isShadowRendering = camera !== cameraLOD;
    LODrenderList = !isShadowRendering ? LODinfo.render : (LODinfo.shadowRender ?? LODinfo.render);

    for (const object of LODinfo.objects) {
      object.count = 0;
    }
  } else if (mainMesh._perObjectFrustumCulled || mainMesh._sortObjects) {
    mainMesh.count = 0;
  }

  if (mainMesh._instancesArrayCount === 0) return;

  if (LODrenderList?.levels.length > 0) mainMesh.frustumCullingLOD(LODrenderList, camera, cameraLOD);
  else mainMesh.frustumCulling(camera);
};

InstancedMesh2.prototype.updateLastRenderInfo = function (frame, camera, shadowCamera) {
  const lastRenderInfo = this._lastRenderInfo;
  lastRenderInfo.frame = frame;
  lastRenderInfo.camera = camera;
  lastRenderInfo.shadowCamera = shadowCamera;
};

InstancedMesh2.prototype.frustumCullingAlreadyPerformed = function (frame, camera, shadowCamera) {
  const lastRenderInfo = this._lastRenderInfo;
  if (
    lastRenderInfo.frame === frame &&
    lastRenderInfo.camera === camera &&
    lastRenderInfo.shadowCamera === shadowCamera
  ) {
    return true;
  }

  this.updateLastRenderInfo(frame, camera, shadowCamera);
  return false;
};

InstancedMesh2.prototype.frustumCulling = function (camera: Camera) {
  const sortObjects = this._sortObjects;
  const perObjectFrustumCulled = this._perObjectFrustumCulled;
  const array = this.instanceIndex.array;

  this.instanceIndex._needsUpdate = true; // TODO improve

  if (!perObjectFrustumCulled && !sortObjects) {
    this.updateIndexArray();
    return;
  }

  if (sortObjects) {
    _invMatrixWorld.copy(this.matrixWorld).invert();
    _cameraPos.setFromMatrixPosition(camera.matrixWorld).applyMatrix4(_invMatrixWorld);
    _forward.set(0, 0, -1).transformDirection(camera.matrixWorld).transformDirection(_invMatrixWorld);
  }

  if (!perObjectFrustumCulled) {
    this.updateRenderList();
  } else {
    _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(this.matrixWorld);

    if (this.bvh) {
      if (this._hasSectors && this._globalTrackedSectorLow) {
        const tracked = this._globalTrackedSectorLow;
        const wo = this._globalWorldOffset;
        _bvhTranslation.makeTranslation(
          -(tracked.x | 0) * SECTOR_SCALE - (wo?.x ?? 0),
          -(tracked.y | 0) * SECTOR_SCALE - (wo?.y ?? 0),
          -(tracked.z | 0) * SECTOR_SCALE - (wo?.z ?? 0),
        );
        _projScreenMatrix.multiply(_bvhTranslation);
      }
      this.BVHCulling(camera);
    } else {
      this.linearCulling(camera);
    }
  }

  if (sortObjects) {
    const customSort = this.customSort;

    if (customSort === null) {
      _renderList.array.sort(!(this.material as Material)?.transparent ? sortOpaque : sortTransparent);
    } else {
      customSort(_renderList.array);
    }

    const list = _renderList.array;
    const count = list.length;
    for (let i = 0; i < count; i++) {
      array[i] = list[i].index;
    }

    this.count = count;
    _renderList.reset();
  }
};

InstancedMesh2.prototype.updateIndexArray = function () {
  if (!this._indexArrayNeedsUpdate) return;

  const array = this.instanceIndex.array;
  const instancesArrayCount = this._instancesArrayCount;
  let count = 0;

  for (let i = 0; i < instancesArrayCount; i++) {
    if (this.getActiveAndVisibilityAt(i)) {
      array[count++] = i;
    }
  }

  this.count = count;
  this._indexArrayNeedsUpdate = false;
};

InstancedMesh2.prototype.updateRenderList = function () {
  const instancesArrayCount = this._instancesArrayCount;

  for (let i = 0; i < instancesArrayCount; i++) {
    if (this.getActiveAndVisibilityAt(i)) {
      const depth = this.getPositionAt(i).sub(_cameraPos).dot(_forward);
      _renderList.push(depth, i);
    }
  }
};

InstancedMesh2.prototype.BVHCulling = function (camera: Camera) {
  const s = _bvhCullingState;
  s.array = this.instanceIndex.array;
  s.instancesArrayCount = this._instancesArrayCount;
  s.sortObjects = this._sortObjects;
  s.onFrustumEnter = this.onFrustumEnter;
  s.camera = camera;
  s.count = 0;
  s.mesh = this;

  this.bvh.frustumCulling(_projScreenMatrix, _bvhCullingCallback);

  this.count = s.count;
  s.mesh = null; // release reference
};

InstancedMesh2.prototype.linearCulling = function (camera: Camera) {
  const array = this.instanceIndex.array;
  if (!this.geometry.boundingSphere) this.geometry.computeBoundingSphere();
  const bSphere = this._geometry.boundingSphere;
  const radius = bSphere.radius;
  const center = bSphere.center;
  const instancesArrayCount = this._instancesArrayCount;
  const geometryCentered = center.x === 0 && center.y === 0 && center.z === 0;
  const sortObjects = this._sortObjects;
  const onFrustumEnter = this.onFrustumEnter;
  let count = 0;

  _frustum.setFromProjectionMatrix(_projScreenMatrix);

  for (let i = 0; i < instancesArrayCount; i++) {
    if (!this.getActiveAndVisibilityAt(i)) continue;

    if (geometryCentered) {
      const maxScale = this.getPositionAndMaxScaleOnAxisAt(i, _sphere.center);
      _sphere.radius = radius * maxScale;
    } else {
      this.applyMatrixAtToSphere(i, _sphere, center, radius);
    }

    if (this._hasSectors) {
      this.getSectorOffsetFor(i, _sectorOffset);
      _sphere.center.add(_sectorOffset);
    }

    if (_frustum.intersectsSphere(_sphere) && (!onFrustumEnter || onFrustumEnter(i, camera))) {
      if (sortObjects) {
        const depth = _position.subVectors(_sphere.center, _cameraPos).dot(_forward);
        _renderList.push(depth, i);
      } else {
        array[count++] = i;
      }
    }
  }

  this.count = count;
};

InstancedMesh2.prototype.frustumCullingLOD = function (
  LODrenderList: LODRenderList,
  camera: Camera,
  cameraLOD: Camera,
) {
  const { count, levels } = LODrenderList;

  for (let i = 0; i < levels.length; i++) {
    if (!levels[i].object.instanceIndex) return;

    count[i] = 0;
    levels[i].object.instanceIndex._needsUpdate = true; // TODO improve
  }

  const isShadowRendering = camera !== cameraLOD;
  const sortObjects = !isShadowRendering && this._sortObjects; // sort is disabled when render shadows

  _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(this.matrixWorld);
  _invMatrixWorld.copy(this.matrixWorld).invert();
  _cameraPos.setFromMatrixPosition(camera.matrixWorld).applyMatrix4(_invMatrixWorld);
  _cameraLODPos.setFromMatrixPosition(cameraLOD.matrixWorld).applyMatrix4(_invMatrixWorld);

  _lodIndexes.length = levels.length;
  for (let i = 0; i < levels.length; i++) {
    _lodIndexes[i] = levels[i].object.instanceIndex.array as Uint32Array;
  }
  const indexes = _lodIndexes;

  if (this.bvh) {
    if (this._hasSectors && this._globalTrackedSectorLow) {
      const tracked = this._globalTrackedSectorLow;
      const wo = this._globalWorldOffset;
      const tx = -(tracked.x | 0) * SECTOR_SCALE - (wo?.x ?? 0);
      const ty = -(tracked.y | 0) * SECTOR_SCALE - (wo?.y ?? 0);
      const tz = -(tracked.z | 0) * SECTOR_SCALE - (wo?.z ?? 0);
      _bvhTranslation.makeTranslation(tx, ty, tz);
      _projScreenMatrix.multiply(_bvhTranslation);
      // Shift camera positions into BVH anchor space for LOD distance calculations
      _cameraPos.x -= tx;
      _cameraPos.y -= ty;
      _cameraPos.z -= tz;
      _cameraLODPos.x -= tx;
      _cameraLODPos.y -= ty;
      _cameraLODPos.z -= tz;
    }
    this.BVHCullingLOD(LODrenderList, indexes, sortObjects, camera, cameraLOD);
  } else {
    this.linearCullingLOD(LODrenderList, indexes, sortObjects, camera, cameraLOD);
  }

  if (sortObjects) {
    const customSort = this.customSort;
    const list = _renderList.array;
    let levelIndex = 0;
    let levelDistance = levels[1].distance;

    if (customSort === null) {
      list.sort(!(levels[0].object.material as Material)?.transparent ? sortOpaque : sortTransparent); // TODO improve multimaterial handling
    } else {
      customSort(list);
    }

    for (let i = 0, l = list.length; i < l; i++) {
      const item = list[i];

      if (item.depth > levelDistance) {
        levelIndex++;
        levelDistance = levels[levelIndex + 1]?.distance ?? Infinity; // improve this condition and use for of instead
      }

      indexes[levelIndex][count[levelIndex]++] = item.index;
    }

    _renderList.reset();
  }

  for (let i = 0; i < levels.length; i++) {
    const object = levels[i].object;
    object.count = count[i];
  }
};

InstancedMesh2.prototype.BVHCullingLOD = function (
  LODrenderList: LODRenderList,
  indexes: Uint32Array[],
  sortObjects: boolean,
  camera: Camera,
  cameraLOD: Camera,
) {
  const { count, levels } = LODrenderList;

  if (sortObjects) {
    const s = _bvhCullingLODSortState;
    s.instancesArrayCount = this._instancesArrayCount;
    s.onFrustumEnter = this.onFrustumEnter;
    s.camera = camera;
    s.cameraLOD = cameraLOD;
    s.mesh = this;

    this.bvh.frustumCulling(_projScreenMatrix, _bvhCullingLODSortCallback);

    s.mesh = null;
  } else {
    const s = _bvhCullingLODState;
    s.instancesArrayCount = this._instancesArrayCount;
    s.onFrustumEnter = this.onFrustumEnter;
    s.camera = camera;
    s.cameraLOD = cameraLOD;
    s.mesh = this;
    s.indexes = indexes;
    s.count = count;
    s.levels = levels;

    this.bvh.frustumCullingLOD(_projScreenMatrix, _cameraLODPos, levels, _bvhCullingLODCallback);

    s.mesh = null;
    s.indexes = null;
    s.count = null;
    s.levels = null;
  }
};

InstancedMesh2.prototype.linearCullingLOD = function (
  LODrenderList: LODRenderList,
  indexes: Uint32Array[],
  sortObjects: boolean,
  camera: Camera,
  cameraLOD: Camera,
) {
  const { count, levels } = LODrenderList;
  if (!this.geometry.boundingSphere) this.geometry.computeBoundingSphere();
  const bSphere = this._geometry.boundingSphere;
  const radius = bSphere.radius;
  const center = bSphere.center;
  const instancesArrayCount = this._instancesArrayCount;
  const geometryCentered = center.x === 0 && center.y === 0 && center.z === 0;
  const onFrustumEnter = this.onFrustumEnter;

  _frustum.setFromProjectionMatrix(_projScreenMatrix);

  for (let i = 0; i < instancesArrayCount; i++) {
    if (!this.getActiveAndVisibilityAt(i)) continue;

    if (geometryCentered) {
      const maxScale = this.getPositionAndMaxScaleOnAxisAt(i, _sphere.center);
      _sphere.radius = radius * maxScale;
    } else {
      this.applyMatrixAtToSphere(i, _sphere, center, radius);
    }

    if (this._hasSectors) {
      this.getSectorOffsetFor(i, _sectorOffset);
      _sphere.center.add(_sectorOffset);
    }

    if (_frustum.intersectsSphere(_sphere)) {
      if (sortObjects) {
        if (!onFrustumEnter || onFrustumEnter(i, camera, cameraLOD)) {
          const distance = _sphere.center.distanceToSquared(_cameraLODPos);
          _renderList.push(distance, i);
        }
      } else {
        const distance = _sphere.center.distanceToSquared(_cameraLODPos);
        const levelIndex = this.getObjectLODIndexForDistance(levels, distance);

        if (!onFrustumEnter || onFrustumEnter(i, camera, cameraLOD, levelIndex)) {
          indexes[levelIndex][count[levelIndex]++] = i;
        }
      }
    }
  }
};
