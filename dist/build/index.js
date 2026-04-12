import { Quaternion as jt, Vector3 as y, Euler as Yt, Box3 as yt, GLBufferAttribute as Zt, DataTexture as bt, WebGLUtils as Qt, ColorManagement as it, NoColorSpace as wt, FloatType as At, UnsignedIntType as Jt, IntType as te, RGBAFormat as ee, RGBAIntegerFormat as se, RGFormat as ne, RGIntegerFormat as ie, RedFormat as Tt, RedIntegerFormat as re, Mesh as St, AttachedBindMode as It, InstancedBufferAttribute as oe, Matrix4 as j, Color as ae, Sphere as ht, DetachedBindMode as ce, Frustum as he, ShaderMaterial as le, Ray as ue, ShaderChunk as x } from "three";
import { BVH as fe, HybridBuilder as de, WebGLCoordinateSystem as pe, vec3ToArray as Ct, box3ToArray as Ot } from "bvh.js";
import { radixSort as me } from "three/addons/utils/SortUtils.js";
class lt {
  constructor() {
    this.x = 0n, this.y = 0n, this.z = 0n;
  }
  /**
   * Sets the sector coordinates.
   * @param x The X coordinate.
   * @param y The Y coordinate.
   * @param z The Z coordinate.
   * @returns This sector instance for chaining.
   */
  set(t, e, s) {
    return this.x = t, this.y = e, this.z = s, this;
  }
  /**
   * Copies values from another Sector instance.
   * @param sector The sector to copy from.
   * @returns This sector instance for chaining.
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  /**
   * Creates a clone of this sector.
   * @returns A new Sector instance with the same values.
   */
  clone() {
    return new lt().copy(this);
  }
  /**
   * Converts this sector to an array.
   * @param array Optional array to write values into.
   * @param offset Starting offset in the array.
   * @returns The array containing the sector values.
   */
  toArray(t, e = 0) {
    return t = t || [], t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
  }
  /**
   * Sets this sector from an array.
   * @param array The array to read values from.
   * @param offset Starting offset in the array.
   * @returns This sector instance for chaining.
   */
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
  }
}
class $t {
  /**
   * This object is instantiated automatically by setting `createEntities` to `true` in the `InstancedMesh2` constructor parameters.
   * Dont instantiate this manually.
   * @param owner The `InstancedMesh2` that owns this instance.
   * @param id The unique identifier for this instance within the `InstancedMesh2`.
   * @param useEuler Whether to use Euler rotations in addition to quaternion rotations.
   */
  constructor(t, e, s) {
    if (this.isInstanceEntity = !0, this.position = new y(), this.scale = new y(1, 1, 1), this.quaternion = new jt(), this.id = e, this.owner = t, s) {
      const n = this.quaternion, i = this.rotation = new Yt();
      i._onChange(() => n.setFromEuler(i, !1)), n._onChange(() => i.setFromQuaternion(n, void 0, !1));
    }
  }
  /**
   * The visibility state set and got from `owner.availabilityArray`.
   */
  get visible() {
    return this.owner.getVisibilityAt(this.id);
  }
  set visible(t) {
    this.owner.setVisibilityAt(this.id, t);
  }
  /**
   * The availability set and got from `owner.availabilityArray`.
   */
  get active() {
    return this.owner.getActiveAt(this.id);
  }
  set active(t) {
    this.owner.setActiveAt(this.id, t);
  }
  /**
   * Color set and got from `owner.colorsTexture`.
   */
  get color() {
    return this.owner.getColorAt(this.id);
  }
  set color(t) {
    this.owner.setColorAt(this.id, t);
  }
  /**
   * Opacity set and got from `owner.colorsTexture`.
   */
  get opacity() {
    return this.owner.getOpacityAt(this.id);
  }
  set opacity(t) {
    this.owner.setOpacityAt(this.id, t);
  }
  /**
   * Sector coordinate set in the owner's matricesTexture.
   */
  setSector(t, e, s) {
    this.owner.setSectorAt(this.id, t, e, s);
  }
  /**
   * Morph target influences set and got from `owner.morphTexture`.
   */
  get morph() {
    return this.owner.getMorphAt(this.id);
  }
  set morph(t) {
    this.owner.setMorphAt(this.id, t);
  }
  /**
   * The local transform matrix got from `owner.matricesTexture`.
   */
  get matrix() {
    return this.owner.getMatrixAt(this.id);
  }
  /**
   * The world transform matrix got by multiplying the matrix got from `owner.matricesTexture` and `this.owner.matrixWorld`.
   */
  get matrixWorld() {
    return this.matrix.premultiply(this.owner.matrixWorld);
  }
  /**
   * @internal
   */
  setMatrixIdentity() {
    const t = this.owner, e = t.matricesTexture._data, s = this.id, n = s * t._matrixStride;
    e[n + 0] = 1, e[n + 1] = 0, e[n + 2] = 0, e[n + 3] = 0, e[n + 4] = 0, e[n + 5] = 1, e[n + 6] = 0, e[n + 7] = 0, e[n + 8] = 0, e[n + 9] = 0, e[n + 10] = 1, e[n + 11] = 0, e[n + 12] = 0, e[n + 13] = 0, e[n + 14] = 0, e[n + 15] = 1, t.matricesTexture.enqueueUpdate(s);
  }
  /**
   * Updates the transformation matrix with its current position, quaternion, and scale.
   * The updated matrix is stored in the `owner.matricesTexture`.
   */
  updateMatrix() {
    const t = this.owner, e = this.position, s = this.quaternion, n = this.scale, i = t.matricesTexture._data, o = this.id, a = o * t._matrixStride, c = s._x, h = s._y, l = s._z, f = s._w, p = c + c, u = h + h, m = l + l, _ = c * p, g = c * u, w = c * m, U = h * u, P = h * m, E = l * m, F = f * p, D = f * u, I = f * m, b = n.x, A = n.y, T = n.z;
    i[a + 0] = (1 - (U + E)) * b, i[a + 1] = (g + I) * b, i[a + 2] = (w - D) * b, i[a + 3] = 0, i[a + 4] = (g - I) * A, i[a + 5] = (1 - (_ + E)) * A, i[a + 6] = (P + F) * A, i[a + 7] = 0, i[a + 8] = (w + D) * T, i[a + 9] = (P - F) * T, i[a + 10] = (1 - (_ + U)) * T, i[a + 11] = 0, i[a + 12] = e.x, i[a + 13] = e.y, i[a + 14] = e.z, i[a + 15] = 1, t.matricesTexture.enqueueUpdate(o), t.bvh && t.autoUpdateBVH && t.bvh.move(o);
  }
  /**
   * Updates only the position component of the transformation matrix.
   * This is useful if only position changes, avoiding recalculating the full matrix.
   * The updated matrix is stored in the `owner.matricesTexture`.
   */
  updateMatrixPosition() {
    const t = this.owner, e = this.position, s = t.matricesTexture._data, n = this.id, i = n * t._matrixStride;
    s[i + 12] = e.x, s[i + 13] = e.y, s[i + 14] = e.z, t.matricesTexture.enqueueUpdate(n), t.bvh && t.autoUpdateBVH && t.bvh.move(n);
  }
  /**
   * Retrieves the uniform value associated with the given name.
   * @param name The name of the uniform to retrieve.
   * @param target Optional target object where the uniform value will be written.
   * @returns The retrieved uniform value.
   */
  getUniform(t, e) {
    return this.owner.getUniformAt(this.id, t, e);
  }
  /**
   * Updates the bones of the skeleton to the instance.
   * @param updateBonesMatrices Whether to update the matrices of the bones. Default is `true`.
   * @param excludeBonesSet An optional set of bone names to exclude from updates, skipping their local matrix updates.
   */
  updateBones(t = !0, e) {
    this.owner.setBonesAt(this.id, t, e);
  }
  /**
   * Sets the uniform value for the given name
   * @param name The name of the uniform to set.
   * @param value The new value for the uniform.
   */
  setUniform(t, e) {
    this.owner.setUniformAt(this.id, t, e);
  }
  /**
   * Copies the transformation properties (`position`, `scale`, `quaternion`) of this instance to the specified `Object3D`.
   * @param target The `Object3D` where the transformation properties will be copied.
   */
  copyTo(t) {
    t.position.copy(this.position), t.scale.copy(this.scale), t.quaternion.copy(this.quaternion), this.rotation && t.rotation.copy(this.rotation);
  }
  /**
   * Applies the matrix transform to the object and updates the object's position, rotation and scale.
   * @param m The matrix to apply.
   * @returns The instance of the object.
   */
  applyMatrix4(t) {
    return this.matrix.premultiply(t).decompose(this.position, this.quaternion, this.scale), this;
  }
  /**
   * Applies the rotation represented by the quaternion to the object.
   * @param q The quaternion representing the rotation to apply.
   * @returns The instance of the object.
   */
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  /**
   * Rotate an object along an axis in object space. The axis is assumed to be normalized.
   * @param axis A normalized vector in object space.
   * @param angle The angle in radians.
   * @returns The instance of the object.
   */
  rotateOnAxis(t, e) {
    return st.setFromAxisAngle(t, e), this.quaternion.multiply(st), this;
  }
  /**
   * Rotate an object along an axis in world space. The axis is assumed to be normalized. Method Assumes no rotated parent.
   * @param axis A normalized vector in world space.
   * @param angle The angle in radians.
   * @returns The instance of the object.
   */
  rotateOnWorldAxis(t, e) {
    return st.setFromAxisAngle(t, e), this.quaternion.premultiply(st), this;
  }
  /**
   * Rotates the object around x axis in local space.
   * @param angle The angle to rotate in radians.
   * @returns The instance of the object.
   */
  rotateX(t) {
    return this.rotateOnAxis(Mt, t);
  }
  /**
   * Rotates the object around y axis in local space.
   * @param angle The angle to rotate in radians.
   * @returns The instance of the object.
   */
  rotateY(t) {
    return this.rotateOnAxis(Ut, t);
  }
  /**
   * Rotates the object around z axis in local space.
   * @param angle The angle to rotate in radians.
   * @returns The instance of the object.
   */
  rotateZ(t) {
    return this.rotateOnAxis(Pt, t);
  }
  /**
   * Translate an object by distance along an axis in object space. The axis is assumed to be normalized.
   * @param axis A normalized vector in object space.
   * @param distance The distance to translate.
   * @returns The instance of the object.
   */
  translateOnAxis(t, e) {
    return Lt.copy(t).applyQuaternion(this.quaternion), this.position.add(Lt.multiplyScalar(e)), this;
  }
  /**
   * Translates object along x axis in object space by distance units.
   * @param distance The distance to translate.
   * @returns The instance of the object.
   */
  translateX(t) {
    return this.translateOnAxis(Mt, t);
  }
  /**
   * Translates object along y axis in object space by distance units.
   * @param distance The distance to translate.
   * @returns The instance of the object.
   */
  translateY(t) {
    return this.translateOnAxis(Ut, t);
  }
  /**
   * Translates object along z axis in object space by distance units.
   * @param distance The distance to translate.
   * @returns The instance of the object.
   */
  translateZ(t) {
    return this.translateOnAxis(Pt, t);
  }
  /**
   * Removes this entity from its owner instance.
   * @returns The instance of the object.
   */
  remove() {
    return this.owner.removeInstances(this.id), this;
  }
}
const st = new jt(), Lt = new y(), Mt = new y(1, 0, 0), Ut = new y(0, 1, 0), Pt = new y(0, 0, 1);
class _e {
  /**
   * @param target The target `InstancedMesh2`.
   * @param margin The margin applied for bounding box calculations (default is 0).
   * @param getBBoxFromBSphere Flag to determine if instance bounding boxes should be computed from the geometry bounding sphere. Faster but less precise (default is false).
   * @param accurateCulling Flag to enable accurate frustum culling without considering margin (default is true).
   */
  constructor(t, e = 0, s = !1, n = !0) {
    this.nodesMap = /* @__PURE__ */ new Map(), this.LODsMap = /* @__PURE__ */ new Map(), this._geoBoundingSphere = null, this._sphereTarget = null, this.target = t, this.accurateCulling = n, this._margin = e;
    const i = t._geometry;
    if (i.boundingBox || i.computeBoundingBox(), this.geoBoundingBox = i.boundingBox, s) {
      i.boundingSphere || i.computeBoundingSphere();
      const o = i.boundingSphere.center;
      o.x === 0 && o.y === 0 && o.z === 0 ? (this._geoBoundingSphere = i.boundingSphere, this._sphereTarget = { centerX: 0, centerY: 0, centerZ: 0, maxScale: 0 }) : (console.warn('"getBoxFromSphere" is ignored because geometry is not centered.'), s = !1);
    }
    this.bvh = new fe(new de(), pe), this._origin = new Float32Array(3), this._dir = new Float32Array(3), this._cameraPos = new Float32Array(3), this._getBoxFromSphere = s;
  }
  /**
   * Builds the BVH from the target mesh's instances using a top-down construction method.
   * This approach is more efficient and accurate compared to incremental methods, which add one instance at a time.
   */
  create() {
    const t = this.target._instancesCount, e = this.target._instancesArrayCount, s = new Array(t), n = new Uint32Array(t);
    let i = 0;
    this.clear();
    for (let o = 0; o < e; o++)
      this.target.getActiveAt(o) && (s[i] = this.getBox(o, new Float32Array(6)), n[i] = o, i++);
    this.bvh.createFromArray(n, s, (o) => {
      this.nodesMap.set(o.object, o);
    }, this._margin);
  }
  /**
   * Inserts an instance into the BVH.
   * @param id The id of the instance to insert.
   */
  insert(t) {
    const e = this.bvh.insert(t, this.getBox(t, new Float32Array(6)), this._margin);
    this.nodesMap.set(t, e);
  }
  /**
   * Inserts a range of instances into the BVH.
   * @param ids An array of ids to insert.
   */
  insertRange(t) {
    const e = t.length, s = new Array(e);
    for (let n = 0; n < e; n++)
      s[n] = this.getBox(t[n], new Float32Array(6));
    this.bvh.insertRange(t, s, this._margin, (n) => {
      this.nodesMap.set(n.object, n);
    });
  }
  /**
   * Moves an instance within the BVH.
   * @param id The id of the instance to move.
   */
  move(t) {
    const e = this.nodesMap.get(t);
    e && (this.getBox(t, e.box), this.bvh.move(e, this._margin));
  }
  /**
   * Deletes an instance from the BVH.
   * @param id The id of the instance to delete.
   */
  delete(t) {
    const e = this.nodesMap.get(t);
    e && (this.bvh.delete(e), this.nodesMap.delete(t));
  }
  /**
   * Clears the BVH.
   */
  clear() {
    this.bvh.clear(), this.nodesMap.clear();
  }
  /**
   * Performs frustum culling to determine which instances are visible based on the provided projection matrix.
   * @param projScreenMatrix The projection screen matrix for frustum culling.
   * @param onFrustumIntersection Callback function invoked when an instance intersects the frustum.
   */
  frustumCulling(t, e) {
    this._margin > 0 && this.accurateCulling ? this.bvh.frustumCulling(t.elements, (s, n, i) => {
      n.isIntersectedMargin(s.box, i, this._margin) && e(s);
    }) : this.bvh.frustumCulling(t.elements, e);
  }
  /**
   * Performs frustum culling with Level of Detail (LOD) consideration.
   * @param projScreenMatrix The projection screen matrix for frustum culling.
   * @param cameraPosition The camera's position used for LOD calculations.
   * @param levels An array of LOD levels.
   * @param onFrustumIntersection Callback function invoked when an instance intersects the frustum.
   */
  frustumCullingLOD(t, e, s, n) {
    this.LODsMap.has(s) || this.LODsMap.set(s, new Float32Array(s.length));
    const i = this.LODsMap.get(s);
    for (let a = 0; a < s.length; a++)
      i[a] = s[a].distance;
    const o = this._cameraPos;
    o[0] = e.x, o[1] = e.y, o[2] = e.z, this._margin > 0 && this.accurateCulling ? this.bvh.frustumCullingLOD(t.elements, o, i, (a, c, h, l) => {
      h.isIntersectedMargin(a.box, l, this._margin) && n(a, c);
    }) : this.bvh.frustumCullingLOD(t.elements, o, i, n);
  }
  /**
   * Performs raycasting to check if a ray intersects any instances.
   * @param raycaster The raycaster used for raycasting.
   * @param onIntersection Callback function invoked when a ray intersects an instance.
   */
  raycast(t, e, s) {
    const n = t.ray, i = this._origin, o = this._dir;
    Ct(n.origin, i), Ct(n.direction, o), s && (i[0] += s.x, i[1] += s.y, i[2] += s.z), this.bvh.rayIntersections(o, i, e, t.near, t.far);
  }
  /**
   * Checks if a given box intersects with any instance bounding box.
   * @param target The target bounding box.
   * @param onIntersection Callback function invoked when an intersection occurs.
   * @returns `True` if there is an intersection, otherwise `false`.
   */
  intersectBox(t, e) {
    this._boxArray || (this._boxArray = new Float32Array(6));
    const s = this._boxArray;
    return Ot(t, s), this.bvh.intersectsBox(s, e);
  }
  getBox(t, e) {
    if (this._getBoxFromSphere) {
      const s = this.target.matricesTexture._data, { centerX: n, centerY: i, centerZ: o, maxScale: a } = this.getSphereFromMatrix_centeredGeometry(t, s, this._sphereTarget), c = this._geoBoundingSphere.radius * a;
      e[0] = n - c, e[1] = n + c, e[2] = i - c, e[3] = i + c, e[4] = o - c, e[5] = o + c;
    } else
      Et.copy(this.geoBoundingBox).applyMatrix4(this.target.getMatrixAt(t)), Ot(Et, e);
    if (this.target._hasSectors) {
      const s = this.target._intView, n = t * this.target._matrixStride + 16, i = s[n] * 128, o = s[n + 1] * 128, a = s[n + 2] * 128;
      e[0] += i, e[1] += i, e[2] += o, e[3] += o, e[4] += a, e[5] += a;
    }
    return e;
  }
  getSphereFromMatrix_centeredGeometry(t, e, s) {
    const n = t * this.target._matrixStride, i = e[n + 0], o = e[n + 1], a = e[n + 2], c = e[n + 4], h = e[n + 5], l = e[n + 6], f = e[n + 8], p = e[n + 9], u = e[n + 10], m = i * i + o * o + a * a, _ = c * c + h * h + l * l, g = f * f + p * p + u * u;
    return s.maxScale = Math.sqrt(Math.max(m, _, g)), s.centerX = e[n + 12], s.centerY = e[n + 13], s.centerZ = e[n + 14], s;
  }
}
const Et = new yt();
class xe extends Zt {
  /**
   * @param gl The WebGL2RenderingContext used to create the buffer.
   * @param type The type of data in the attribute.
   * @param itemSize The number of elements per attribute.
   * @param elementSize The size of individual elements in the array.
   * @param array The data array that holds the attribute values.
   * @param meshPerAttribute The number of meshes that share the same attribute data.
   */
  constructor(t, e, s, n, i, o = 1) {
    const a = t.createBuffer();
    super(a, e, s, n, i.length / s), this.isGLInstancedBufferAttribute = !0, this._needsUpdate = !1, this.isInstancedBufferAttribute = !0, this.meshPerAttribute = o, this.array = i, this._cacheArray = i, t.bindBuffer(t.ARRAY_BUFFER, a), t.bufferData(t.ARRAY_BUFFER, i, t.DYNAMIC_DRAW);
  }
  /**
   * Updates the buffer data.
   * This method is designed to be called during the `onBeforeRender` callback.
   * It ensures that the attribute data is updated just before the rendering process begins.
   * @param renderer The WebGLRenderer used to render the scene.
   * @param count The number of elements to update in the buffer.
   */
  update(t, e) {
    if (!this._needsUpdate || e === 0) return;
    const s = t.getContext();
    s.bindBuffer(s.ARRAY_BUFFER, this.buffer), this.array === this._cacheArray ? s.bufferSubData(s.ARRAY_BUFFER, 0, this.array, 0, e) : (s.bufferData(s.ARRAY_BUFFER, this.array, s.DYNAMIC_DRAW), this._cacheArray = this.array), this._needsUpdate = !1;
  }
  /** @internal */
  clone() {
    return this;
  }
}
let ut = null, ft = null;
const Ft = {};
function ge(r) {
  return ft.get(r)?.() ?? ut(r);
}
function ye(r) {
  ft.has(r) || be(r);
}
function be(r) {
  const t = {};
  ft.set(r, () => {
    if (r.isMeshDistanceMaterial) {
      const e = ut(r);
      t.light = e.light;
    }
    return t;
  });
}
function Ae(r, t, e) {
  const s = t.properties;
  ut = s.get;
  const n = r._propertiesKey ?? `${!!r.colorsTexture}_${r._useOpacity}_${!!r.boneTexture}_${!!r.uniformsTexture}`;
  Ft[n] ??= /* @__PURE__ */ new WeakMap(), ft = Ft[n], s.get = ge, ye(e);
}
function Te(r) {
  r.properties.get = ut;
}
function Gt(r, t) {
  return Math.max(t, Math.ceil(Math.sqrt(r / t)) * t);
}
function Se(r, t, e, s) {
  t === 3 && (console.warn('"channels" cannot be 3. Set to 4. More info: https://github.com/mrdoob/three.js/pull/23228'), t = 4);
  const n = Gt(s, e), i = new r(n * n * t), o = r.name.includes("Float"), a = r.name.includes("Uint"), c = o ? At : a ? Jt : te;
  let h;
  switch (t) {
    case 1:
      h = o ? Tt : re;
      break;
    case 2:
      h = o ? ne : ie;
      break;
    case 4:
      h = o ? ee : se;
      break;
  }
  return { array: i, size: n, type: c, format: h };
}
class W extends bt {
  // Pool of reusable row info objects
  /**
   * @param arrayType The constructor for the TypedArray.
   * @param channels The number of channels in the texture.
   * @param pixelsPerInstance The number of pixels required for each instance.
   * @param capacity The total number of instances.
   * @param uniformMap Optional map for handling uniform values.
   * @param fetchInFragmentShader Optional flag that determines if uniform values should be fetched in the fragment shader instead of the vertex shader.
   */
  constructor(t, e, s, n, i, o) {
    e === 3 && (e = 4);
    const { array: a, format: c, size: h, type: l } = Se(t, e, s, n);
    super(a, h, h, c, l), this.partialUpdate = !0, this.maxUpdateCalls = 1 / 0, this._utils = null, this._needsUpdate = !0, this._lastWidth = -1, this._rowsInfoResult = [], this._rowsInfoPool = [], this._data = a, this._channels = e, this._pixelsPerInstance = s, this._stride = s * e, this._rowToUpdate = new Array(h), this._uniformMap = i, this._fetchUniformsInFragmentShader = o, this.needsUpdate = !0;
  }
  /**
   * Resizes the texture to accommodate a new number of instances.
   * @param count The new total number of instances.
   */
  resize(t) {
    const e = Gt(t, this._pixelsPerInstance);
    if (e === this.image.width) return;
    const s = this._data, n = this._channels;
    this._rowToUpdate.length = e;
    const i = s.constructor, o = new i(e * e * n), a = Math.min(s.length, o.length);
    o.set(new i(s.buffer, 0, a)), this.dispose(), this.image = { data: o, height: e, width: e }, this._data = o;
  }
  /**
   * Marks a row of the texture for update during the next render cycle.
   * This helps in optimizing texture updates by only modifying the rows that have changed.
   * @param index The index of the instance to update.
   */
  enqueueUpdate(t) {
    if (this._needsUpdate = !0, !this.partialUpdate) return;
    const e = this.image.width / this._pixelsPerInstance, s = Math.floor(t / e);
    this._rowToUpdate[s] = !0;
  }
  bindToProgram(t, e, s, n, i) {
    if (!n[i]) return;
    n[i].value = this;
    const o = this.getSlot(s, i);
    if (o === void 0) return;
    const a = t.properties.get(this);
    t.state.bindTexture(e.TEXTURE_2D, a.__webglTexture, e.TEXTURE0 + o);
  }
  /**
   * Updates the texture data based on the rows that need updating.
   * This method is optimized to only update the rows that have changed, improving performance.
   * @param renderer The WebGLRenderer used for rendering.
   * @param materialProperties The material properties associated with the texture.
   * @param uniformName The name of the uniform in the shader.
   */
  update(t, e, s) {
    const n = t.properties.get(this), i = n.__version !== this.version;
    if (!this._needsUpdate && !i) return;
    const o = this._lastWidth !== this.image.width;
    if (!n.__webglTexture || o)
      t.initTexture(this);
    else {
      const a = this.getSlot(e, s) ?? t.capabilities.maxTextures - 1;
      this.partialUpdate ? this.updatePartial(n, t, a) : this.updateFull(n, t, a), n.__version = this.version;
    }
    this._lastWidth = this.image.width, this._needsUpdate = !1;
  }
  getSlot(t, e) {
    return t[e]?.cache[0];
  }
  updateFull(t, e, s) {
    this.updateRows(t, e, [{ row: 0, count: this.image.height }], s);
  }
  updatePartial(t, e, s) {
    const n = this.getUpdateRowsInfo();
    n.length !== 0 && (n.length > this.maxUpdateCalls ? this.updateFull(t, e, s) : this.updateRows(t, e, n, s), this._rowToUpdate.fill(!1));
  }
  // PATCHED: Reuse objects to prevent GC pressure
  getUpdateRowsInfo() {
    const t = this._rowToUpdate, e = this._rowsInfoResult;
    e.length = 0;
    for (let s = 0, n = t.length; s < n; s++)
      if (t[s]) {
        const i = s;
        for (; s < n && t[s]; s++)
          ;
        let o = this._rowsInfoPool.pop();
        o || (o = { row: 0, count: 0 }), o.row = i, o.count = s - i, e.push(o);
      }
    return e;
  }
  updateRows(t, e, s, n) {
    const i = e.getContext();
    this._utils ??= new Qt(i, e.extensions, e.capabilities);
    const o = this._utils.convert(this.format), a = this._utils.convert(this.type), { data: c, width: h } = this.image, l = this._channels;
    e.state.activeTexture(i.TEXTURE0 + n), e.state.bindTexture(i.TEXTURE_2D, t.__webglTexture, i.TEXTURE0 + n);
    const f = it.getPrimaries(it.workingColorSpace), p = this.colorSpace === wt ? null : it.getPrimaries(this.colorSpace), u = this.colorSpace === wt || f === p ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
    i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, this.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, this.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, u);
    for (const { count: m, row: _ } of s)
      i.texSubImage2D(i.TEXTURE_2D, 0, 0, _, h, m, o, a, c, _ * h * l);
    for (const m of s)
      this._rowsInfoPool.push(m);
    this.onUpdate?.(this);
  }
  /**
   * Sets a uniform value at the specified instance ID in the texture.
   * @param id The instance ID to set the uniform for.
   * @param name The name of the uniform.
   * @param value The value to set for the uniform.
   */
  setUniformAt(t, e, s) {
    const { offset: n, size: i } = this._uniformMap.get(e), o = this._stride;
    i === 1 ? this._data[t * o + n] = s : s.toArray(this._data, t * o + n);
  }
  /**
   * Retrieves a uniform value at the specified instance ID from the texture.
   * @param id The instance ID to retrieve the uniform from.
   * @param name The name of the uniform.
   * @param target Optional target object to store the uniform value.
   * @returns The uniform value for the specified instance.
   */
  getUniformAt(t, e, s) {
    const { offset: n, size: i } = this._uniformMap.get(e), o = this._stride;
    return i === 1 ? this._data[t * o + n] : s.fromArray(this._data, t * o + n);
  }
  /**
   * Generates the GLSL code for accessing the uniform data stored in the texture.
   * @param textureName The name of the texture in the GLSL shader.
   * @param indexName The name of the index in the GLSL shader.
   * @param indexType The type of the index in the GLSL shader.
   * @returns An object containing the GLSL code for the vertex and fragment shaders.
   */
  getUniformsGLSL(t, e, s) {
    const n = this.getUniformsVertexGLSL(t, e, s), i = this.getUniformsFragmentGLSL(t, e, s);
    return { vertex: n, fragment: i };
  }
  getUniformsVertexGLSL(t, e, s) {
    if (this._fetchUniformsInFragmentShader)
      return `
        flat varying ${s} ez_v${e}; 
        void main() {
          ez_v${e} = ${e};`;
    const n = this.texelsFetchGLSL(t, e), i = this.getFromTexelsGLSL(), { assignVarying: o, declareVarying: a } = this.getVarying();
    return `
      uniform highp sampler2D ${t};  
      ${a}
      void main() {
        ${n}
        ${i}
        ${o}`;
  }
  getUniformsFragmentGLSL(t, e, s) {
    if (!this._fetchUniformsInFragmentShader) {
      const { declareVarying: o, getVarying: a } = this.getVarying();
      return `
      ${o}
      void main() {
        ${a}`;
    }
    const n = this.texelsFetchGLSL(t, `ez_v${e}`), i = this.getFromTexelsGLSL();
    return `
      uniform highp sampler2D ${t};  
      flat varying ${s} ez_v${e};
      void main() {
        ${n}
        ${i}`;
  }
  texelsFetchGLSL(t, e) {
    const s = this._pixelsPerInstance;
    let n = `
      int size = textureSize(${t}, 0).x;
      int j = int(${e}) * ${s};
      int x = j % size;
      int y = j / size;
    `;
    for (let i = 0; i < s; i++)
      n += `vec4 ez_texel${i} = texelFetch(${t}, ivec2(x + ${i}, y), 0);
`;
    return n;
  }
  getFromTexelsGLSL() {
    const t = this._uniformMap;
    let e = "";
    for (const [s, { type: n, offset: i, size: o }] of t) {
      const a = Math.floor(i / this._channels);
      if (n === "mat3")
        e += `mat3 ${s} = mat3(ez_texel${a}.rgb, vec3(ez_texel${a}.a, ez_texel${a + 1}.rg), vec3(ez_texel${a + 1}.ba, ez_texel${a + 2}.r));
`;
      else if (n === "mat4")
        e += `mat4 ${s} = mat4(ez_texel${a}, ez_texel${a + 1}, ez_texel${a + 2}, ez_texel${a + 3});
`;
      else {
        const c = this.getUniformComponents(i, o);
        e += `${n} ${s} = ez_texel${a}.${c};
`;
      }
    }
    return e;
  }
  getVarying() {
    const t = this._uniformMap;
    let e = "", s = "", n = "";
    for (const [i, { type: o }] of t)
      e += `flat varying ${o} ez_v${i};
`, s += `ez_v${i} = ${i};
`, n += `${o} ${i} = ez_v${i};
`;
    return { declareVarying: e, assignVarying: s, getVarying: n };
  }
  getUniformComponents(t, e) {
    const s = t % this._channels;
    let n = "";
    for (let i = 0; i < e; i++)
      n += ve[s + i];
    return n;
  }
  copy(t) {
    return super.copy(t), this.partialUpdate = t.partialUpdate, this.maxUpdateCalls = t.maxUpdateCalls, this._channels = t._channels, this._pixelsPerInstance = t._pixelsPerInstance, this._stride = t._stride, this._rowToUpdate = t._rowToUpdate, this._uniformMap = t._uniformMap, this._fetchUniformsInFragmentShader = t._fetchUniformsInFragmentShader, this;
  }
}
const ve = ["r", "g", "b", "a"], ct = class ct extends St {
  /**
   * @remarks Geometry cannot be shared. If reused, it will be cloned.
   * @param geometry An instance of `BufferGeometry`.
   * @param material A single or an array of `Material`.
   * @param params Optional configuration parameters object. See `InstancedMesh2Params` for details.
   */
  constructor(t, e, s = {}, n) {
    if (!t) throw new Error('"geometry" is mandatory.');
    if (!e) throw new Error('"material" is mandatory.');
    const {
      allowsEuler: i,
      renderer: o,
      createEntities: a,
      globalWorldOffset: c,
      globalTrackedSectorLow: h,
      globalTrackedSectorHigh: l,
      texturePool: f
    } = s;
    super(t, null), this.type = "InstancedMesh2", this.isInstancedMesh2 = !0, this.instances = null, this.instanceIndex = null, this.colorsTexture = null, this._intView = null, this.morphTexture = null, this.boneTexture = null, this.uniformsTexture = null, this.boundingBox = null, this.boundingSphere = null, this.bvh = null, this.customSort = null, this.raycastOnlyFrustum = !1, this.LODinfo = null, this.autoUpdate = !0, this.bindMode = It, this.bindMatrix = null, this.bindMatrixInverse = null, this.skeleton = null, this.autoUpdateBVH = !0, this.onFrustumEnter = null, this._renderer = null, this._instancesCount = 0, this._instancesArrayCount = 0, this._perObjectFrustumCulled = !0, this._sortObjects = !1, this._indexArrayNeedsUpdate = !1, this._useOpacity = !1, this._currentMaterial = null, this._customProgramCacheKeyBase = null, this._onBeforeCompileBase = null, this._definesBase = null, this._freeIds = [], this._globalWorldOffset = null, this._globalTrackedSectorLow = null, this._globalTrackedSectorHigh = null, this._texturePool = null, this._propertiesKey = null, this._cachedProgramCacheKey = null, this._lastCachedMaterial = null, this.isInstancedMesh = !0, this.instanceMatrix = new oe(new Float32Array(0), 16), this.instanceColor = null, this._customProgramCacheKey = () => this._cachedProgramCacheKey !== null && this._lastCachedMaterial === this._currentMaterial ? this._cachedProgramCacheKey : (this._lastCachedMaterial = this._currentMaterial, this._cachedProgramCacheKey = `ez_${this._propertiesKey}_${this._customProgramCacheKeyBase.call(this._currentMaterial)}`, this._cachedProgramCacheKey), this._onBeforeCompile = (u, m) => {
      if (this._onBeforeCompileBase && this._onBeforeCompileBase.call(this._currentMaterial, u, m), u.defines = { ...u.defines }, u.defines.USE_INSTANCING_INDIRECT = "", u.uniforms.matricesTexture = { value: this.matricesTexture }, this.uniformsTexture) {
        u.uniforms.uniformsTexture = { value: this.uniformsTexture };
        const { vertex: _, fragment: g } = this.uniformsTexture.getUniformsGLSL("uniformsTexture", "instanceIndex", "uint");
        u.vertexShader = u.vertexShader.replace("void main() {", _), u.fragmentShader = u.fragmentShader.replace("void main() {", g);
      }
      this.colorsTexture && u.fragmentShader.includes("#include <color_pars_fragment>") && (u.defines.USE_INSTANCING_COLOR_INDIRECT = "", u.uniforms.colorsTexture = { value: this.colorsTexture }, u.vertexShader = u.vertexShader.replace("<color_vertex>", "<instanced_color_vertex>"), u.vertexColors && (u.defines.USE_VERTEX_COLOR = ""), u.defines.USE_COLOR_ALPHA = ""), this.boneTexture && (u.defines.USE_SKINNING = "", u.defines.USE_INSTANCING_SKINNING = "", u.uniforms.bindMatrix = { value: this.bindMatrix }, u.uniforms.bindMatrixInverse = { value: this.bindMatrixInverse }, u.uniforms.bonesPerInstance = { value: this.skeleton.bones.length }, u.uniforms.boneTexture = { value: this.boneTexture }), this._hasSectors && (u.defines.USE_INSTANCING_SECTOR_INDIRECT = "", u.uniforms.worldOffset = { value: this._globalWorldOffset ?? new y(0, 0, 0) }, u.uniforms.trackedSectorLow = { value: this._globalTrackedSectorLow ?? { x: 0, y: 0, z: 0 } }, u.uniforms.trackedSectorHigh = { value: this._globalTrackedSectorHigh ?? { x: 0, y: 0, z: 0 } }, u.vertexShader = u.vertexShader.replace(
        "#include <project_vertex>",
        `
        vec4 mvPosition = vec4( transformed, 1.0 );

        #ifdef USE_BATCHING
          mvPosition = batchingMatrix * mvPosition;
        #endif

        #ifdef USE_INSTANCING_INDIRECT
          mvPosition = instanceMatrix * mvPosition;
          // Apply sector offset (includes worldOffset internally via getSectorOffset)
          mvPosition.xyz += getSectorOffset();
        #endif

        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
        `
      ));
    };
    const p = s.capacity > 0 ? s.capacity : we;
    this._renderer = o, this._capacity = p, this._parentLOD = n, this._geometry = t, this._globalWorldOffset = c ?? null, this._globalTrackedSectorLow = h ?? null, this._globalTrackedSectorHigh = l ?? null, this._texturePool = f ?? null, this.material = e, this._hasSectors = !!c, this._matrixStride = this._hasSectors ? 24 : 16, this._allowsEuler = i ?? !1, this._tempInstance = new $t(this, -1, i), this.availabilityArray = n?.availabilityArray ?? new Array(p * 2), this._createEntities = a, this.initLastRenderInfo(), this.initIndexAttribute(), this.initMatricesTexture();
  }
  // must be null to avoid exception
  /**
   * The capacity of the instance buffers.
   */
  get capacity() {
    return this._capacity;
  }
  /**
   * The number of active instances.
   */
  get instancesCount() {
    return this._instancesCount;
  }
  /**
   * Determines if per-instance frustum culling is enabled.
   * @default true
   */
  get perObjectFrustumCulled() {
    return this._perObjectFrustumCulled;
  }
  set perObjectFrustumCulled(t) {
    this._perObjectFrustumCulled = t, this._indexArrayNeedsUpdate = !0;
  }
  /**
   * Determines if objects should be sorted before rendering.
   * @default false
   */
  get sortObjects() {
    return this._sortObjects;
  }
  set sortObjects(t) {
    this._sortObjects = t, this._indexArrayNeedsUpdate = !0;
  }
  /**
   * An instance of `BufferGeometry` (or derived classes), defining the object's structure.
   */
  // @ts-expect-error It's defined as a property, but is overridden as an accessor.
  get geometry() {
    return this._geometry;
  }
  set geometry(t) {
    this._geometry = t, this.patchGeometry(t);
  }
  onBeforeShadow(t, e, s, n, i, o, a) {
    if (this._instancesArrayCount === 0) return;
    this.patchMaterial(t, o), this.updateTextures(t, o);
    const c = t.info.render.frame;
    this.instanceIndex && this.autoUpdate && !this.frustumCullingAlreadyPerformed(c, s, n) && this.performFrustumCulling(n, s), this.count !== 0 && (this.instanceIndex.update(this._renderer, this.count), this.bindTextures(t, o));
  }
  onBeforeRender(t, e, s, n, i, o) {
    if (this._instancesArrayCount === 0) return;
    if (this.patchMaterial(t, i), this.updateTextures(t, i), !this.instanceIndex) {
      this._renderer = t;
      return;
    }
    const a = t.info.render.frame;
    this.autoUpdate && !this.frustumCullingAlreadyPerformed(a, s, null) && this.performFrustumCulling(s), this.count !== 0 && (this.instanceIndex.update(this._renderer, this.count), this.bindTextures(t, i));
  }
  onAfterShadow(t, e, s, n, i, o, a) {
    this.unpatchMaterial(t, o);
  }
  onAfterRender(t, e, s, n, i, o) {
    this.unpatchMaterial(t, i), !(this.instanceIndex || o && !this.isLastGroup(o.materialIndex)) && this.initIndexAttribute();
  }
  updateTextures(t, e) {
    const s = t.properties.get(e);
    this.matricesTexture.update(t, s, "matricesTexture"), this.colorsTexture?.update(t, s, "colorsTexture"), this.uniformsTexture?.update(t, s, "uniformsTexture"), this.boneTexture?.update(t, s, "boneTexture");
  }
  bindTextures(t, e) {
    const s = t.properties.get(e), n = s.uniforms;
    if (!n) return;
    const i = s.currentProgram, o = i?.program;
    if (!o) return;
    const a = t.getContext(), c = i.getUniforms().map, h = a.getParameter(a.CURRENT_PROGRAM);
    t.state.useProgram(o), this.matricesTexture.bindToProgram(t, a, c, n, "matricesTexture"), this.colorsTexture?.bindToProgram(t, a, c, n, "colorsTexture"), this.uniformsTexture?.bindToProgram(t, a, c, n, "uniformsTexture"), this.boneTexture?.bindToProgram(t, a, c, n, "boneTexture"), t.state.useProgram(h);
  }
  isLastGroup(t) {
    const e = this.material;
    for (let s = e.length - 1; s >= t; s--)
      if (e[s].visible)
        return s === t;
  }
  initIndexAttribute() {
    if (!this._renderer) {
      this.count = 0;
      return;
    }
    const t = this._renderer.getContext(), e = this._capacity, s = new Uint32Array(e);
    for (let n = 0; n < e; n++)
      s[n] = n;
    this.instanceIndex = new xe(t, t.UNSIGNED_INT, 1, 4, s), this._geometry.setAttribute("instanceIndex", this.instanceIndex);
  }
  initLastRenderInfo() {
    this._parentLOD || (this._lastRenderInfo = { frame: -1, camera: null, shadowCamera: null });
  }
  initMatricesTexture() {
    if (!this._parentLOD) {
      const t = this._hasSectors ? 6 : 4;
      this.matricesTexture = this._texturePool ? this._texturePool.acquire(Float32Array, 4, t, this._capacity) : new W(Float32Array, 4, t, this._capacity), this._hasSectors && (this._intView = new Int32Array(this.matricesTexture._data.buffer)), this.updatePropertiesKey();
    }
  }
  initColorsTexture() {
    this._parentLOD || (this.colorsTexture = this._texturePool ? this._texturePool.acquire(Float32Array, 4, 1, this._capacity) : new W(Float32Array, 4, 1, this._capacity), this.colorsTexture.colorSpace = it.workingColorSpace, this.colorsTexture._data.fill(1), this.materialsNeedsUpdate(), this.updatePropertiesKey());
  }
  materialsNeedsUpdate() {
    if (this.material.isMaterial) {
      this.material.needsUpdate = !0;
      return;
    }
    for (const t of this.material)
      t.needsUpdate = !0;
  }
  /** @internal */
  updatePropertiesKey() {
    this._propertiesKey = `${!!this.colorsTexture}_${this._useOpacity}_${!!this.boneTexture}_${!!this.uniformsTexture}_${this._hasSectors}`, this._cachedProgramCacheKey = null;
  }
  patchGeometry(t) {
    const e = t.getAttribute("instanceIndex");
    if (e) {
      if (e === this.instanceIndex) return;
      console.warn("The geometry has been cloned because it was already used."), t = t.clone(), t.deleteAttribute("instanceIndex");
    }
    this.instanceIndex && t.setAttribute("instanceIndex", this.instanceIndex);
  }
  patchMaterial(t, e) {
    this._currentMaterial = e, this._customProgramCacheKeyBase = e.customProgramCacheKey, this._onBeforeCompileBase = e.onBeforeCompile, this._definesBase = e.defines, e.customProgramCacheKey = this._customProgramCacheKey, e.onBeforeCompile = this._onBeforeCompile, Ae(this, t, e);
  }
  unpatchMaterial(t, e) {
    this._currentMaterial = null, Te(t), e.defines = this._definesBase, e.onBeforeCompile = this._onBeforeCompileBase, e.customProgramCacheKey = this._customProgramCacheKeyBase, this._onBeforeCompileBase = null, this._customProgramCacheKeyBase = null, this._definesBase = null;
  }
  /**
   * Creates and computes the BVH (Bounding Volume Hierarchy) for the instances.
   * It's recommended to create it when all the instance matrices have been assigned.
   * Once created it will be updated automatically.
   * @param config Optional configuration parameters object. See `BVHParams` for details.
   */
  computeBVH(t = {}) {
    this.bvh || (this.bvh = new _e(this, t.margin, t.getBBoxFromBSphere, t.accurateCulling)), this.bvh.clear(), this.bvh.create();
  }
  /**
   * Disposes of the BVH structure.
   */
  disposeBVH() {
    this.bvh = null;
  }
  /**
   * Sets the local transformation matrix for a specific instance.
   * @param id The index of the instance.
   * @param matrix A `Matrix4` representing the local transformation to apply to the instance.
   */
  setMatrixAt(t, e) {
    if (e.toArray(this.matricesTexture._data, t * this._matrixStride), this.instances) {
      const s = this.instances[t];
      e.decompose(s.position, s.quaternion, s.scale);
    }
    this.matricesTexture.enqueueUpdate(t), this.bvh && this.autoUpdateBVH && this.bvh.move(t);
  }
  /**
   * Gets the local transformation matrix of a specific instance.
   * @param id The index of the instance.
   * @param matrix Optional `Matrix4` to store the result.
   * @returns The transformation matrix of the instance.
   */
  getMatrixAt(t, e = Ie) {
    return e.fromArray(this.matricesTexture._data, t * this._matrixStride);
  }
  /**
   * Retrieves the position of a specific instance.
   * @param index The index of the instance.
   * @param target Optional `Vector3` to store the result.
   * @returns The position of the instance as a `Vector3`.
   */
  getPositionAt(t, e = mt) {
    const s = t * this._matrixStride, n = this.matricesTexture._data;
    return e.x = n[s + 12], e.y = n[s + 13], e.z = n[s + 14], e;
  }
  /** @internal */
  getPositionAndMaxScaleOnAxisAt(t, e) {
    const s = t * this._matrixStride, n = this.matricesTexture._data, i = n[s + 0], o = n[s + 1], a = n[s + 2], c = i * i + o * o + a * a, h = n[s + 4], l = n[s + 5], f = n[s + 6], p = h * h + l * l + f * f, u = n[s + 8], m = n[s + 9], _ = n[s + 10], g = u * u + m * m + _ * _;
    return e.x = n[s + 12], e.y = n[s + 13], e.z = n[s + 14], Math.sqrt(Math.max(c, p, g));
  }
  /** @internal */
  applyMatrixAtToSphere(t, e, s, n) {
    const i = t * this._matrixStride, o = this.matricesTexture._data, a = o[i + 0], c = o[i + 1], h = o[i + 2], l = o[i + 3], f = o[i + 4], p = o[i + 5], u = o[i + 6], m = o[i + 7], _ = o[i + 8], g = o[i + 9], w = o[i + 10], U = o[i + 11], P = o[i + 12], E = o[i + 13], F = o[i + 14], D = o[i + 15], I = e.center, b = s.x, A = s.y, T = s.z, z = 1 / (l * b + m * A + U * T + D);
    I.x = (a * b + f * A + _ * T + P) * z, I.y = (c * b + p * A + g * T + E) * z, I.z = (h * b + u * A + w * T + F) * z;
    const $ = a * a + c * c + h * h, G = f * f + p * p + u * u, V = _ * _ + g * g + w * w;
    e.radius = n * Math.sqrt(Math.max($, G, V));
  }
  /**
   * Sets the visibility of a specific instance.
   * @param id The index of the instance.
   * @param visible Whether the instance should be visible.
   */
  setVisibilityAt(t, e) {
    this.availabilityArray[t * 2] = e, this._indexArrayNeedsUpdate = !0;
  }
  /**
   * Gets the visibility of a specific instance.
   * @param id The index of the instance.
   * @returns Whether the instance is visible.
   */
  getVisibilityAt(t) {
    return this.availabilityArray[t * 2];
  }
  /**
   * Sets the availability of a specific instance.
   * @param id The index of the instance.
   * @param active Whether the instance is active (not deleted).
   */
  setActiveAt(t, e) {
    this.availabilityArray[t * 2 + 1] = e, this._indexArrayNeedsUpdate = !0;
  }
  /**
   * Gets the availability of a specific instance.
   * @param id The index of the instance.
   * @returns Whether the instance is active (not deleted).
   */
  getActiveAt(t) {
    return this.availabilityArray[t * 2 + 1];
  }
  /**
   * Indicates if a specific instance is visible and active.
   * @param id The index of the instance.
   * @returns Whether the instance is visible and active.
   */
  getActiveAndVisibilityAt(t) {
    const e = t * 2, s = this.availabilityArray;
    return s[e] && s[e + 1];
  }
  /**
   * Set if a specific instance is visible and active.
   * @param id The index of the instance.
   * @param value Whether the instance is active and active (not deleted).
   */
  setActiveAndVisibilityAt(t, e) {
    const s = t * 2, n = this.availabilityArray;
    n[s] = e, n[s + 1] = e, this._indexArrayNeedsUpdate = !0;
  }
  /**
   * Sets the color of a specific instance.
   * @param id The index of the instance.
   * @param color The color to assign to the instance.
   */
  setColorAt(t, e) {
    this.colorsTexture === null && this.initColorsTexture(), e.isColor ? e.toArray(this.colorsTexture._data, t * 4) : Bt.set(e).toArray(this.colorsTexture._data, t * 4), this.colorsTexture.enqueueUpdate(t);
  }
  /**
   * Gets the color of a specific instance.
   * @param id The index of the instance.
   * @param color Optional `Color` to store the result.
   * @returns The color of the instance.
   */
  getColorAt(t, e = Bt) {
    return e.fromArray(this.colorsTexture._data, t * 4);
  }
  /**
   * Sets the opacity of a specific instance.
   * @param id The index of the instance.
   * @param value The opacity value to assign.
   */
  setOpacityAt(t, e) {
    this._useOpacity || (this.colorsTexture === null ? this.initColorsTexture() : this.materialsNeedsUpdate(), this._useOpacity = !0, this.updatePropertiesKey()), this.colorsTexture._data[t * 4 + 3] = e, this.colorsTexture.enqueueUpdate(t);
  }
  /**
   * Gets the opacity of a specific instance.
   * @param id The index of the instance.
   * @returns The opacity of the instance.
   */
  getOpacityAt(t) {
    return this._useOpacity ? this.colorsTexture._data[t * 4 + 3] : 1;
  }
  /**
   * Splits a 64-bit integer into low and high 32-bit parts.
   * @param value The BigInt value to split.
   * @returns A tuple of [low32, high32] as numbers.
   */
  splitInt64(t) {
    const e = ct._splitResult;
    return e[0] = Number(t & 0xffffffffn), e[1] = Number(t >> 32n), e;
  }
  /**
   * Reconstructs a 64-bit integer from low and high 32-bit parts.
   * @param low The low 32 bits.
   * @param high The high 32 bits.
   * @returns The reconstructed BigInt value.
   */
  combineInt64(t, e) {
    return BigInt(t) | BigInt(e) << 32n;
  }
  /**
   * Sets the sector coordinate for a specific instance.
   * @param id The index of the instance.
   * @param sector The sector coordinate to set.
   */
  setSectorAt(t, e, s, n) {
    const i = this._intView;
    if (!i) return;
    const o = t * this._matrixStride + 16, [a, c] = this.splitInt64(e), [h, l] = this.splitInt64(s), [f, p] = this.splitInt64(n);
    i[o + 0] = a, i[o + 1] = h, i[o + 2] = f, i[o + 3] = 0, i[o + 4] = c, i[o + 5] = l, i[o + 6] = p, i[o + 7] = 0, this.matricesTexture.enqueueUpdate(t);
  }
  /**
   * Retrieves the sector coordinate of a specific instance.
   * @param id The index of the instance.
   * @param target Optional Sector object to store the result.
   * @returns The sector coordinate of the instance.
   */
  getSectorAt(t, e = new lt()) {
    const s = this._intView;
    if (!s)
      return e.set(0n, 0n, 0n);
    const n = t * this._matrixStride + 16, i = s[n + 0], o = s[n + 1], a = s[n + 2], c = s[n + 4], h = s[n + 5], l = s[n + 6];
    return e.x = this.combineInt64(i, c), e.y = this.combineInt64(o, h), e.z = this.combineInt64(a, l), e;
  }
  /**
   * Copies `position`, `quaternion`, and `scale` of a specific instance to the specified target `Object3D`.
   * @param id The index of the instance.
   * @param target The `Object3D` where to copy transformation data.
   */
  copyTo(t, e) {
    this.getMatrixAt(t, e.matrix).decompose(e.position, e.quaternion, e.scale);
  }
  /**
   * Computes the bounding box that encloses all instances, and updates the `boundingBox` attribute.
   */
  computeBoundingBox() {
    const t = this._geometry, e = this._instancesArrayCount;
    this.boundingBox ??= new yt(), t.boundingBox === null && t.computeBoundingBox();
    const s = t.boundingBox, n = this.boundingBox;
    n.makeEmpty();
    for (let i = 0; i < e; i++)
      this.getActiveAt(i) && (Dt.copy(s).applyMatrix4(this.getMatrixAt(i)), n.union(Dt));
  }
  /**
   * Computes the bounding sphere that encloses all instances, and updates the `boundingSphere` attribute.
   */
  computeBoundingSphere() {
    const t = this._geometry, e = this._instancesArrayCount;
    this.boundingSphere ??= new ht(), t.boundingSphere === null && t.computeBoundingSphere();
    const s = t.boundingSphere, n = this.boundingSphere;
    n.makeEmpty();
    for (let i = 0; i < e; i++)
      this.getActiveAt(i) && (pt.copy(s).applyMatrix4(this.getMatrixAt(i)), this._hasSectors && (this.getSectorOffsetFor(i, mt), pt.center.add(mt)), n.union(pt));
  }
  clone(t) {
    const e = {
      capacity: this._capacity,
      renderer: this._renderer,
      allowsEuler: this._allowsEuler,
      createEntities: this._createEntities,
      globalWorldOffset: this._globalWorldOffset,
      globalTrackedSectorLow: this._globalTrackedSectorLow,
      globalTrackedSectorHigh: this._globalTrackedSectorHigh,
      texturePool: this._texturePool
    };
    return new this.constructor(this.geometry, this.material, e).copy(this, t);
  }
  copy(t, e) {
    return super.copy(t, e), this.count = t._capacity, this._instancesCount = t._instancesCount, this._instancesArrayCount = t._instancesArrayCount, this._capacity = t._capacity, t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()), t.boundingSphere !== null && (this.boundingSphere = t.boundingSphere.clone()), this.matricesTexture = t.matricesTexture.clone(), this.matricesTexture.image.data = this.matricesTexture.image.data.slice(), this._hasSectors && (this._intView = new Int32Array(this.matricesTexture._data.buffer)), t.colorsTexture !== null && (this.colorsTexture = t.colorsTexture.clone(), this.colorsTexture.image.data = this.colorsTexture.image.data.slice()), t.uniformsTexture !== null && (this.uniformsTexture = t.uniformsTexture.clone(), this.uniformsTexture.image.data = this.uniformsTexture.image.data.slice()), t.morphTexture !== null && (this.morphTexture = t.morphTexture.clone(), this.morphTexture.image.data = this.morphTexture.image.data.slice()), t.boneTexture !== null && (this.boneTexture = t.boneTexture.clone(), this.boneTexture.image.data = this.boneTexture.image.data.slice()), this;
  }
  /**
   * Frees the GPU-related resources allocated.
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" }), this._texturePool ? (this._texturePool.release(this.matricesTexture), this.colorsTexture && this._texturePool.release(this.colorsTexture), this.boneTexture && this._texturePool.release(this.boneTexture), this.uniformsTexture && this._texturePool.release(this.uniformsTexture)) : (this.matricesTexture.dispose(), this.colorsTexture?.dispose(), this.boneTexture?.dispose(), this.uniformsTexture?.dispose()), this.morphTexture?.dispose();
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t), this.bindMatrixInverse && (this.bindMode === It ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === ce ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : console.warn("Unrecognized bindMode: " + this.bindMode));
  }
};
ct._splitResult = [0, 0];
let d = ct;
const we = 1e3, Dt = new yt(), pt = new ht(), Ie = new j(), Bt = new ae(), mt = new y();
d.prototype.resizeBuffers = function(r) {
  const t = this._capacity;
  this._capacity = r;
  const e = Math.min(r, t);
  if (this.instanceIndex) {
    const s = new Uint32Array(r);
    s.set(new Uint32Array(this.instanceIndex.array.buffer, 0, e)), this.instanceIndex.array = s;
  }
  if (this.LODinfo) {
    for (const s of this.LODinfo.objects)
      if (s._capacity = r, s.instanceIndex) {
        const n = new Uint32Array(r);
        n.set(new Uint32Array(s.instanceIndex.array.buffer, 0, e)), s.instanceIndex.array = n;
      }
  }
  if (this.availabilityArray.length = r * 2, this.matricesTexture.resize(r), this._hasSectors && (this._intView = new Int32Array(this.matricesTexture._data.buffer)), this.colorsTexture && (this.colorsTexture.resize(r), r > t && this.colorsTexture._data.fill(1, t * 4)), this.morphTexture) {
    const s = this.morphTexture.image.data, n = s.length / t;
    this.morphTexture.dispose(), this.morphTexture = new bt(new Float32Array(n * r), n, r, Tt, At), this.morphTexture.image.data.set(s);
  }
  return this.uniformsTexture?.resize(r), this;
};
d.prototype.setInstancesArrayCount = function(r) {
  if (r < this._instancesArrayCount) {
    const e = this.bvh;
    if (e)
      for (let s = this._instancesArrayCount - 1; s >= r; s--)
        this.getActiveAt(s) && e.delete(s);
    this._instancesArrayCount = r;
    return;
  }
  if (r > this._capacity) {
    let e = this._capacity + (this._capacity >> 1) + 512;
    for (; e < r; )
      e += (e >> 1) + 512;
    this.resizeBuffers(e);
  }
  const t = this._instancesArrayCount;
  this._instancesArrayCount = r, this._createEntities && this.createEntities(t);
};
function Ge(r) {
  const t = {
    get: (e) => e.depthSort,
    aux: new Array(r._capacity),
    reversed: !1
  };
  return function(s) {
    t.reversed = !!r.material?.transparent, r._capacity > t.aux.length && (t.aux.length = r._capacity);
    let n = 1 / 0, i = -1 / 0;
    const o = s.length;
    for (let h = 0; h < o; h++) {
      const l = s[h].depth;
      l > i && (i = l), l < n && (n = l);
    }
    const a = i - n, c = (2 ** 32 - 1) / a;
    for (let h = 0; h < o; h++) {
      const l = s[h];
      l.depthSort = (l.depth - n) * c;
    }
    me(s, t);
  };
}
function Vt(r, t) {
  return r.depth - t.depth;
}
function qt(r, t) {
  return t.depth - r.depth;
}
class Ce {
  constructor() {
    this.array = [], this.pool = [];
  }
  /**
   * Adds a new render item to the list.
   * @param depth The depth value used for sorting or determining the rendering order.
   * @param index The unique instance id of the render item.
   */
  push(t, e) {
    const s = this.pool, n = this.array, i = n.length;
    i >= s.length && s.push({ depth: null, index: null, depthSort: null });
    const o = s[i];
    o.depth = t, o.index = e, n.push(o);
  }
  /**
   * Resets the render list by clearing the array.
   */
  reset() {
    this.array.length = 0;
  }
}
const Wt = {
  array: null,
  instancesArrayCount: 0,
  sortObjects: !1,
  onFrustumEnter: null,
  camera: null,
  count: 0,
  mesh: null
};
function Oe(r) {
  const t = Wt, e = r.object;
  if (e < t.instancesArrayCount && t.mesh.getVisibilityAt(e) && (!t.onFrustumEnter || t.onFrustumEnter(e, t.camera)))
    if (t.sortObjects) {
      t.mesh.getPositionAt(e, L), t.mesh._hasSectors && (t.mesh.getSectorOffsetFor(e, M), L.add(M));
      const s = L.sub(R).dot(dt);
      O.push(s, e);
    } else
      t.array[t.count++] = e;
}
const Kt = {
  instancesArrayCount: 0,
  onFrustumEnter: null,
  camera: null,
  cameraLOD: null,
  mesh: null
};
function Le(r) {
  const t = Kt, e = r.object;
  if (e < t.instancesArrayCount && t.mesh.getVisibilityAt(e) && (!t.onFrustumEnter || t.onFrustumEnter(e, t.camera, t.cameraLOD))) {
    t.mesh.getPositionAt(e, L), t.mesh._hasSectors && (t.mesh.getSectorOffsetFor(e, M), L.add(M));
    const s = L.distanceToSquared(B);
    O.push(s, e);
  }
}
const Ht = {
  instancesArrayCount: 0,
  onFrustumEnter: null,
  camera: null,
  cameraLOD: null,
  mesh: null,
  indexes: null,
  count: null,
  levels: null
};
function Me(r, t) {
  const e = Ht, s = r.object;
  if (s < e.instancesArrayCount && e.mesh.getVisibilityAt(s)) {
    if (t === null) {
      e.mesh.getPositionAt(s, L), e.mesh._hasSectors && (e.mesh.getSectorOffsetFor(s, M), L.add(M));
      const n = L.distanceToSquared(B);
      t = e.mesh.getObjectLODIndexForDistance(e.levels, n);
    }
    (!e.onFrustumEnter || e.onFrustumEnter(s, e.camera, e.cameraLOD, t)) && (e.indexes[t][e.count[t]++] = s);
  }
}
const rt = new he(), O = new Ce(), N = new j(), q = new j(), dt = new y(), R = new y(), B = new y(), L = new y(), S = new ht(), C = new lt(), M = new y(), ot = new j(), v = 128, _t = [];
d.prototype.getSectorAwarePosition = function(r, t) {
  if (this.getPositionAt(r, t), !this._hasSectors || !this._globalTrackedSectorLow || !this._globalTrackedSectorHigh)
    return t;
  this.getSectorAt(r, C);
  const e = Number(C.x & 0xffffffffn) - this._globalTrackedSectorLow.x, s = Number(C.y & 0xffffffffn) - this._globalTrackedSectorLow.y, n = Number(C.z & 0xffffffffn) - this._globalTrackedSectorLow.z, i = Number(C.x >> 32n) - this._globalTrackedSectorHigh.x, o = Number(C.y >> 32n) - this._globalTrackedSectorHigh.y, a = Number(C.z >> 32n) - this._globalTrackedSectorHigh.z, c = (e + i * 4294967296) * v, h = (s + o * 4294967296) * v, l = (n + a * 4294967296) * v, f = this._globalWorldOffset ?? { x: 0, y: 0, z: 0 };
  return t.x += c - f.x, t.y += h - f.y, t.z += l - f.z, t;
};
d.prototype.getSectorOffsetFor = function(r, t) {
  if (t.set(0, 0, 0), !this._hasSectors || !this._globalTrackedSectorLow) return t;
  this.getSectorAt(r, C);
  const e = this._globalTrackedSectorLow, s = Number(C.x & 0xffffffffn), n = Number(C.y & 0xffffffffn), i = Number(C.z & 0xffffffffn), o = s - e.x | 0, a = n - e.y | 0, c = i - e.z | 0, h = this._globalWorldOffset;
  return t.x = o * v - (h?.x ?? 0), t.y = a * v - (h?.y ?? 0), t.z = c * v - (h?.z ?? 0), t;
};
d.prototype.performFrustumCulling = function(r, t = r) {
  const e = this._parentLOD ?? this, s = e.LODinfo;
  let n;
  if (s) {
    n = r !== t ? s.shadowRender ?? s.render : s.render;
    for (const o of s.objects)
      o.count = 0;
  } else (e._perObjectFrustumCulled || e._sortObjects) && (e.count = 0);
  e._instancesArrayCount !== 0 && (n?.levels.length > 0 ? e.frustumCullingLOD(n, r, t) : e.frustumCulling(r));
};
d.prototype.updateLastRenderInfo = function(r, t, e) {
  const s = this._lastRenderInfo;
  s.frame = r, s.camera = t, s.shadowCamera = e;
};
d.prototype.frustumCullingAlreadyPerformed = function(r, t, e) {
  const s = this._lastRenderInfo;
  return s.frame === r && s.camera === t && s.shadowCamera === e ? !0 : (this.updateLastRenderInfo(r, t, e), !1);
};
d.prototype.frustumCulling = function(r) {
  const t = this._sortObjects, e = this._perObjectFrustumCulled, s = this.instanceIndex.array;
  if (this.instanceIndex._needsUpdate = !0, !e && !t) {
    this.updateIndexArray();
    return;
  }
  if (t && (q.copy(this.matrixWorld).invert(), R.setFromMatrixPosition(r.matrixWorld).applyMatrix4(q), dt.set(0, 0, -1).transformDirection(r.matrixWorld).transformDirection(q)), !e)
    this.updateRenderList();
  else if (N.multiplyMatrices(r.projectionMatrix, r.matrixWorldInverse).multiply(this.matrixWorld), this.bvh) {
    if (this._hasSectors && this._globalTrackedSectorLow) {
      const n = this._globalTrackedSectorLow, i = this._globalWorldOffset;
      ot.makeTranslation(
        -(n.x | 0) * v - (i?.x ?? 0),
        -(n.y | 0) * v - (i?.y ?? 0),
        -(n.z | 0) * v - (i?.z ?? 0)
      ), N.multiply(ot);
    }
    this.BVHCulling(r);
  } else
    this.linearCulling(r);
  if (t) {
    const n = this.customSort;
    n === null ? O.array.sort(this.material?.transparent ? qt : Vt) : n(O.array);
    const i = O.array, o = i.length;
    for (let a = 0; a < o; a++)
      s[a] = i[a].index;
    this.count = o, O.reset();
  }
};
d.prototype.updateIndexArray = function() {
  if (!this._indexArrayNeedsUpdate) return;
  const r = this.instanceIndex.array, t = this._instancesArrayCount;
  let e = 0;
  for (let s = 0; s < t; s++)
    this.getActiveAndVisibilityAt(s) && (r[e++] = s);
  this.count = e, this._indexArrayNeedsUpdate = !1;
};
d.prototype.updateRenderList = function() {
  const r = this._instancesArrayCount;
  for (let t = 0; t < r; t++)
    if (this.getActiveAndVisibilityAt(t)) {
      const e = this.getPositionAt(t).sub(R).dot(dt);
      O.push(e, t);
    }
};
d.prototype.BVHCulling = function(r) {
  const t = Wt;
  t.array = this.instanceIndex.array, t.instancesArrayCount = this._instancesArrayCount, t.sortObjects = this._sortObjects, t.onFrustumEnter = this.onFrustumEnter, t.camera = r, t.count = 0, t.mesh = this, this.bvh.frustumCulling(N, Oe), this.count = t.count, t.mesh = null;
};
d.prototype.linearCulling = function(r) {
  const t = this.instanceIndex.array;
  this.geometry.boundingSphere || this.geometry.computeBoundingSphere();
  const e = this._geometry.boundingSphere, s = e.radius, n = e.center, i = this._instancesArrayCount, o = n.x === 0 && n.y === 0 && n.z === 0, a = this._sortObjects, c = this.onFrustumEnter;
  let h = 0;
  rt.setFromProjectionMatrix(N);
  for (let l = 0; l < i; l++)
    if (this.getActiveAndVisibilityAt(l)) {
      if (o) {
        const f = this.getPositionAndMaxScaleOnAxisAt(l, S.center);
        S.radius = s * f;
      } else
        this.applyMatrixAtToSphere(l, S, n, s);
      if (this._hasSectors && (this.getSectorOffsetFor(l, M), S.center.add(M)), rt.intersectsSphere(S) && (!c || c(l, r)))
        if (a) {
          const f = L.subVectors(S.center, R).dot(dt);
          O.push(f, l);
        } else
          t[h++] = l;
    }
  this.count = h;
};
d.prototype.frustumCullingLOD = function(r, t, e) {
  const { count: s, levels: n } = r;
  for (let c = 0; c < n.length; c++) {
    if (!n[c].object.instanceIndex) return;
    s[c] = 0, n[c].object.instanceIndex._needsUpdate = !0;
  }
  const o = !(t !== e) && this._sortObjects;
  N.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse).multiply(this.matrixWorld), q.copy(this.matrixWorld).invert(), R.setFromMatrixPosition(t.matrixWorld).applyMatrix4(q), B.setFromMatrixPosition(e.matrixWorld).applyMatrix4(q), _t.length = n.length;
  for (let c = 0; c < n.length; c++)
    _t[c] = n[c].object.instanceIndex.array;
  const a = _t;
  if (this.bvh) {
    if (this._hasSectors && this._globalTrackedSectorLow) {
      const c = this._globalTrackedSectorLow, h = this._globalWorldOffset, l = -(c.x | 0) * v - (h?.x ?? 0), f = -(c.y | 0) * v - (h?.y ?? 0), p = -(c.z | 0) * v - (h?.z ?? 0);
      ot.makeTranslation(l, f, p), N.multiply(ot), R.x -= l, R.y -= f, R.z -= p, B.x -= l, B.y -= f, B.z -= p;
    }
    this.BVHCullingLOD(r, a, o, t, e);
  } else
    this.linearCullingLOD(r, a, o, t, e);
  if (o) {
    const c = this.customSort, h = O.array;
    let l = 0, f = n[1].distance;
    c === null ? h.sort(n[0].object.material?.transparent ? qt : Vt) : c(h);
    for (let p = 0, u = h.length; p < u; p++) {
      const m = h[p];
      m.depth > f && (l++, f = n[l + 1]?.distance ?? 1 / 0), a[l][s[l]++] = m.index;
    }
    O.reset();
  }
  for (let c = 0; c < n.length; c++) {
    const h = n[c].object;
    h.count = s[c];
  }
};
d.prototype.BVHCullingLOD = function(r, t, e, s, n) {
  const { count: i, levels: o } = r;
  if (e) {
    const a = Kt;
    a.instancesArrayCount = this._instancesArrayCount, a.onFrustumEnter = this.onFrustumEnter, a.camera = s, a.cameraLOD = n, a.mesh = this, this.bvh.frustumCulling(N, Le), a.mesh = null;
  } else {
    const a = Ht;
    a.instancesArrayCount = this._instancesArrayCount, a.onFrustumEnter = this.onFrustumEnter, a.camera = s, a.cameraLOD = n, a.mesh = this, a.indexes = t, a.count = i, a.levels = o, this.bvh.frustumCullingLOD(N, B, o, Me), a.mesh = null, a.indexes = null, a.count = null, a.levels = null;
  }
};
d.prototype.linearCullingLOD = function(r, t, e, s, n) {
  const { count: i, levels: o } = r;
  this.geometry.boundingSphere || this.geometry.computeBoundingSphere();
  const a = this._geometry.boundingSphere, c = a.radius, h = a.center, l = this._instancesArrayCount, f = h.x === 0 && h.y === 0 && h.z === 0, p = this.onFrustumEnter;
  rt.setFromProjectionMatrix(N);
  for (let u = 0; u < l; u++)
    if (this.getActiveAndVisibilityAt(u)) {
      if (f) {
        const m = this.getPositionAndMaxScaleOnAxisAt(u, S.center);
        S.radius = c * m;
      } else
        this.applyMatrixAtToSphere(u, S, h, c);
      if (this._hasSectors && (this.getSectorOffsetFor(u, M), S.center.add(M)), rt.intersectsSphere(S))
        if (e) {
          if (!p || p(u, s, n)) {
            const m = S.center.distanceToSquared(B);
            O.push(m, u);
          }
        } else {
          const m = S.center.distanceToSquared(B), _ = this.getObjectLODIndexForDistance(o, m);
          (!p || p(u, s, n, _)) && (t[_][i[_]++] = u);
        }
    }
};
d.prototype.clearTempInstance = function(r) {
  const t = this._tempInstance;
  return t.id = r, this.clearInstance(t);
};
d.prototype.clearTempInstancePosition = function(r) {
  const t = this._tempInstance;
  return t.id = r, t.position.set(0, 0, 0), t;
};
d.prototype.clearInstance = function(r) {
  return r.position.set(0, 0, 0), r.scale.set(1, 1, 1), r.quaternion.identity(), r;
};
d.prototype.updateInstances = function(r) {
  const t = this._instancesArrayCount, e = this.instances;
  for (let s = 0; s < t; s++) {
    if (!this.getActiveAt(s)) continue;
    const n = e ? e[s] : this.clearTempInstance(s);
    r(n, s), n.updateMatrix();
  }
  return this;
};
d.prototype.updateInstancesPosition = function(r) {
  const t = this._instancesArrayCount, e = this.instances;
  for (let s = 0; s < t; s++) {
    if (!this.getActiveAt(s)) continue;
    const n = e ? e[s] : this.clearTempInstancePosition(s);
    r(n, s), n.updateMatrixPosition();
  }
  return this;
};
d.prototype.createEntities = function(r) {
  const t = this._instancesArrayCount;
  if (!this.instances)
    this.instances = new Array(t);
  else if (this.instances.length < t)
    this.instances.length = t;
  else
    return this;
  const e = this.instances;
  for (let s = r; s < t; s++)
    e[s] || (e[s] = new $t(this, s, this._allowsEuler));
  return this;
};
d.prototype.addInstances = function(r, t) {
  !t && this.bvh && console.warn("InstancedMesh2: if `computeBVH()` has already been called, it is better to valorize the instances in the `onCreation` callback for better performance.");
  const e = this._freeIds;
  if (e.length > 0) {
    let i = -1;
    const o = Math.min(e.length, r), a = e.length - o;
    for (let c = e.length - 1; c >= a; c--) {
      const h = e[c];
      h > i && (i = h), this.addInstance(h, t);
    }
    e.length -= o, r -= o, this._instancesArrayCount = Math.max(i + 1, this._instancesArrayCount);
  }
  const s = this._instancesArrayCount, n = s + r;
  this.setInstancesArrayCount(n);
  for (let i = s; i < n; i++)
    this.addInstance(i, t);
  return this;
};
d.prototype.addInstance = function(r, t) {
  this._instancesCount++, this.setActiveAndVisibilityAt(r, !0);
  const e = this.instances ? this.clearInstance(this.instances[r]) : this.clearTempInstance(r);
  t ? (t(e, r), e.updateMatrix()) : e.setMatrixIdentity(), this.bvh?.insert(r);
};
d.prototype.removeInstances = function(...r) {
  const t = this._freeIds, e = this.bvh;
  for (const s of r)
    s < this._instancesArrayCount && this.getActiveAt(s) && (this.setActiveAt(s, !1), t.push(s), e?.delete(s), this._instancesCount--);
  for (let s = this._instancesArrayCount - 1; s >= 0 && !this.getActiveAt(s); s--)
    this._instancesArrayCount--;
  return this;
};
d.prototype.clearInstances = function() {
  if (this._instancesCount = 0, this._instancesArrayCount = 0, this._freeIds.length = 0, this.bvh?.clear(), this.LODinfo)
    for (const r of this.LODinfo.objects)
      r.count = 0;
  return this;
};
d.prototype.getObjectLODIndexForDistance = function(r, t) {
  for (let e = r.length - 1; e > 0; e--) {
    const s = r[e], n = s.distance - s.distance * s.hysteresis;
    if (t >= n) return e;
  }
  return 0;
};
d.prototype.setFirstLODDistance = function(r) {
  if (this._parentLOD)
    throw new Error("Cannot create LOD for this InstancedMesh2.");
  return this.LODinfo || (this.LODinfo = { render: null, shadowRender: null, objects: [this] }), this.LODinfo.render || (this.LODinfo.render = {
    levels: [{ distance: r, hysteresis: 0, object: this }],
    // hysteresis is always 0 at first level
    count: [0]
  }), this;
};
d.prototype.addLOD = function(r, t, e = 0, s = 0) {
  if (this._parentLOD)
    throw new Error("Cannot create LOD for this InstancedMesh2.");
  if (!this.LODinfo?.render && e === 0)
    throw new Error('Cannot set distance to 0 for the first LOD. Call "setFirstLODDistance" method before use "addLOD".');
  return this.setFirstLODDistance(0), this.addLevel(this.LODinfo.render, r, t, e, s), this;
};
d.prototype.addShadowLOD = function(r, t = 0, e = 0) {
  if (this._parentLOD)
    throw new Error("Cannot create LOD for this InstancedMesh2.");
  this.LODinfo || (this.LODinfo = { render: null, shadowRender: null, objects: [this] }), this.LODinfo.shadowRender || (this.LODinfo.shadowRender = { levels: [], count: [] });
  const s = this.addLevel(this.LODinfo.shadowRender, r, null, t, e);
  return s.castShadow = !0, this.castShadow = !0, this;
};
d.prototype.addLevel = function(r, t, e, s, n) {
  const i = this.LODinfo.objects, o = r.levels;
  let a, c;
  s = s ** 2;
  const h = i.findIndex((l) => l.geometry === t);
  if (h === -1) {
    const l = { capacity: this._capacity, renderer: this._renderer };
    c = new d(t, e ?? new le(), l, this), c.frustumCulled = !1, this.patchLevel(c), i.push(c), this.add(c);
  } else
    c = i[h], e && (c.material = e);
  for (a = 0; a < o.length && !(s < o[a].distance); a++)
    ;
  return o.splice(a, 0, { distance: s, hysteresis: n, object: c }), r.count.push(0), c;
};
d.prototype.updateLevel = function(r, t, e, s) {
  if (!r) throw new Error("Render list is invalid.");
  const n = r.levels[t];
  if (!n) throw new Error("Cannot update an empty LOD.");
  if (e != null && !Number.isNaN(e)) {
    const i = e ** 2;
    n.distance = i;
  }
  return s != null && !Number.isNaN(s) && (n.hysteresis = s), this;
};
d.prototype.updateLOD = function(r, t, e) {
  const s = this?.LODinfo?.render;
  if (r === 0) throw new Error("Cannot change distance for LOD0. It is the main mesh and must stay at 0.");
  return this.updateLevel(s, r, t, e);
};
d.prototype.updateShadowLOD = function(r, t, e) {
  return this.updateLevel(this.LODinfo?.shadowRender, r, t, e);
};
d.prototype.updateAllLevels = function(r, t, e) {
  if (!r?.levels) throw new Error("Invalid LOD list.");
  const s = r.levels, n = this.LODinfo?.render === r, i = n ? 1 : 0;
  n && (s[0].distance = 0);
  const o = t?.length > 0;
  let a = [];
  o && (a = n && t[0] === 0 ? t.slice(1, Math.min(s.length, t.length)) : t.slice(0, Math.min(s.length - i, t.length)), a.every((h, l) => {
    if (l > 0 && h <= a[l - 1]) throw new Error(`LOD distances must be strictly increasing: d[${l - 1}]=${a[l - 1]} < d[${l}]=${h}`);
    return !0;
  }));
  const c = o ? a.length : s.length - i;
  for (let h = 0; h < c; h++) {
    const l = o ? a[h] : void 0, f = Array.isArray(e) ? e[h] : e;
    this.updateLevel(r, i + h, l, f);
  }
  return this;
};
d.prototype.updateAllLOD = function(r, t) {
  return this.updateAllLevels(this.LODinfo?.render, r, t);
};
d.prototype.updateAllShadowLOD = function(r, t) {
  return this.updateAllLevels(this.LODinfo?.shadowRender, r, t);
};
d.prototype.disposeLOD = function(r) {
  r.geometry.dispose();
  const t = r.material;
  if (Array.isArray(t)) for (const e of t) e.dispose();
  else t.dispose();
};
d.prototype.removeLOD = function(r, t = !0) {
  const e = this.LODinfo, s = e?.render;
  if (!s?.levels) throw new Error("Invalid LOD list.");
  const n = s.levels.length;
  if (r < 0 || r >= n) throw new Error("Level index OOB");
  if (n > 1 && r === 0) throw new Error("Cannot remove LOD0 while others exist");
  const [i] = s.levels.splice(r, 1);
  s.count?.splice?.(r, 1), s.levels.length <= 1 && (e.render = null);
  const o = i.object, a = this.LODinfo?.shadowRender;
  if (a?.levels && r < a.levels.length && (a.levels.splice(r, 1), a.count?.splice?.(r, 1), a.levels.length === 0 && (this.LODinfo.shadowRender = null)), t && o !== this)
    try {
      this.remove(o);
      const c = e.objects?.indexOf(o) ?? -1;
      c !== -1 && e.objects.splice(c, 1), this.disposeLOD(o);
    } catch (c) {
      console.error(c);
    }
  return this;
};
d.prototype.patchLevel = function(r) {
  Object.defineProperty(r, "renderOrder", {
    get() {
      return this._parentLOD.renderOrder;
    }
  }), Object.defineProperty(r, "_lastRenderInfo", {
    get() {
      return this._parentLOD._lastRenderInfo;
    }
  }), Object.defineProperty(r, "matricesTexture", {
    get() {
      return this._parentLOD.matricesTexture;
    }
  }), Object.defineProperty(r, "colorsTexture", {
    get() {
      return this._parentLOD.colorsTexture;
    }
  }), Object.defineProperty(r, "uniformsTexture", {
    get() {
      return this._parentLOD.uniformsTexture;
    }
  }), Object.defineProperty(r, "morphTexture", {
    // TODO check if it's correct
    get() {
      return this._parentLOD.morphTexture;
    }
  }), Object.defineProperty(r, "boneTexture", {
    get() {
      return this._parentLOD.boneTexture;
    }
  }), Object.defineProperty(r, "skeleton", {
    get() {
      return this._parentLOD.skeleton;
    }
  }), Object.defineProperty(r, "bindMatrixInverse", {
    get() {
      return this._parentLOD.bindMatrixInverse;
    }
  }), Object.defineProperty(r, "bindMatrix", {
    get() {
      return this._parentLOD.bindMatrix;
    }
  });
};
const Ue = new St();
d.prototype.getMorphAt = function(r, t = Ue) {
  const e = t.morphTargetInfluences, s = this.morphTexture.source.data.data, n = e.length + 1, i = r * n + 1;
  for (let o = 0; o < e.length; o++)
    e[o] = s[i + o];
  return t;
};
d.prototype.setMorphAt = function(r, t) {
  const e = t.morphTargetInfluences, s = e.length + 1;
  this.morphTexture === null && !this._parentLOD && (this.morphTexture = new bt(new Float32Array(s * this._capacity), s, this._capacity, Tt, At));
  const n = this.morphTexture.source.data.data;
  let i = 0;
  for (const c of e)
    i += c;
  const o = this._geometry.morphTargetsRelative ? 1 : 1 - i, a = s * r;
  n[a] = o, n.set(e, a + 1), this.morphTexture.needsUpdate = !0;
};
const xt = [], k = new St(), Pe = new ue(), Nt = new y(), zt = new y(), Rt = new j(), at = new ht(), nt = new y(), kt = new y(), gt = 128;
d.prototype.raycast = function(r, t) {
  if (this._parentLOD || !this.material || this._instancesArrayCount === 0 || !this.instanceIndex || !this._hasSectors && (this.boundingSphere === null && this.computeBoundingSphere(), at.copy(this.boundingSphere).applyMatrix4(this.matrixWorld), !r.ray.intersectsSphere(at)))
    return;
  k.geometry = this._geometry, k.material = this.material;
  const e = r.ray, s = r.near, n = r.far;
  Rt.copy(this.matrixWorld).invert(), zt.setFromMatrixScale(this.matrixWorld), Nt.copy(r.ray.direction).multiply(zt);
  const i = Nt.length();
  r.ray = Pe.copy(r.ray).applyMatrix4(Rt), r.near /= i, r.far /= i, this.raycastInstances(r, t), r.ray = e, r.near = s, r.far = n;
};
d.prototype.raycastInstances = function(r, t) {
  if (this.bvh) {
    let e;
    if (this._hasSectors && this._globalTrackedSectorLow) {
      const s = this._globalTrackedSectorLow, n = this._globalWorldOffset;
      kt.set(
        (s.x | 0) * gt + (n?.x ?? 0),
        (s.y | 0) * gt + (n?.y ?? 0),
        (s.z | 0) * gt + (n?.z ?? 0)
      ), e = kt;
    }
    this.bvh.raycast(r, (s) => this.checkObjectIntersection(r, s, t), e);
  } else {
    if (this.boundingSphere === null && this.computeBoundingSphere(), at.copy(this.boundingSphere), !r.ray.intersectsSphere(at)) return;
    const e = this.instanceIndex.array, n = this.raycastOnlyFrustum && this._perObjectFrustumCulled ? this.count : this._instancesArrayCount;
    for (let i = 0; i < n; i++)
      this.checkObjectIntersection(r, e[i], t);
  }
};
d.prototype.checkObjectIntersection = function(r, t, e) {
  if (!(t > this._instancesArrayCount || !this.getActiveAndVisibilityAt(t))) {
    this.getMatrixAt(t, k.matrixWorld), this._hasSectors && (this.getSectorOffsetFor(t, nt), k.matrixWorld.elements[12] += nt.x, k.matrixWorld.elements[13] += nt.y, k.matrixWorld.elements[14] += nt.z), k.raycast(r, xt);
    for (const s of xt)
      s.instanceId = t, s.object = this, e.push(s);
    xt.length = 0;
  }
};
d.prototype.initSkeleton = function(r, t = !0) {
  if (r && this.skeleton !== r && !this._parentLOD) {
    const e = r.bones;
    if (this.skeleton = r, this.bindMatrix = new j(), this.bindMatrixInverse = new j(), this.boneTexture = this._texturePool ? this._texturePool.acquire(Float32Array, 4, 4 * e.length, this._capacity) : new W(Float32Array, 4, 4 * e.length, this._capacity), this.updatePropertiesKey(), t)
      for (const s of e)
        s.matrixAutoUpdate = !1, s.matrixWorldAutoUpdate = !1;
    this.materialsNeedsUpdate();
  }
};
d.prototype.setBonesAt = function(r, t = !0, e) {
  const s = this.skeleton;
  if (!s)
    throw new Error('"setBonesAt" cannot be called before "initSkeleton"');
  const n = s.bones, i = s.boneInverses;
  for (let o = 0, a = n.length; o < a; o++) {
    const c = n[o];
    t && (e?.has(c.name) || c.updateMatrix(), c.matrixWorld.multiplyMatrices(c.parent.matrixWorld, c.matrix)), this.multiplyBoneMatricesAt(r, o, c.matrixWorld, i[o]);
  }
  this.boneTexture.enqueueUpdate(r);
};
d.prototype.multiplyBoneMatricesAt = function(r, t, e, s) {
  const n = (r * this.skeleton.bones.length + t) * 16, i = e.elements, o = s.elements, a = this.boneTexture._data, c = i[0], h = i[4], l = i[8], f = i[12], p = i[1], u = i[5], m = i[9], _ = i[13], g = i[2], w = i[6], U = i[10], P = i[14], E = i[3], F = i[7], D = i[11], I = i[15], b = o[0], A = o[4], T = o[8], z = o[12], $ = o[1], G = o[5], V = o[9], K = o[13], H = o[2], X = o[6], Y = o[10], Z = o[14], Q = o[3], J = o[7], tt = o[11], et = o[15];
  a[n + 0] = c * b + h * $ + l * H + f * Q, a[n + 4] = c * A + h * G + l * X + f * J, a[n + 8] = c * T + h * V + l * Y + f * tt, a[n + 12] = c * z + h * K + l * Z + f * et, a[n + 1] = p * b + u * $ + m * H + _ * Q, a[n + 5] = p * A + u * G + m * X + _ * J, a[n + 9] = p * T + u * V + m * Y + _ * tt, a[n + 13] = p * z + u * K + m * Z + _ * et, a[n + 2] = g * b + w * $ + U * H + P * Q, a[n + 6] = g * A + w * G + U * X + P * J, a[n + 10] = g * T + w * V + U * Y + P * tt, a[n + 14] = g * z + w * K + U * Z + P * et, a[n + 3] = E * b + F * $ + D * H + I * Q, a[n + 7] = E * A + F * G + D * X + I * J, a[n + 11] = E * T + F * V + D * Y + I * tt, a[n + 15] = E * z + F * K + D * Z + I * et;
};
d.prototype.getUniformAt = function(r, t, e) {
  if (!this.uniformsTexture)
    throw new Error(`Before get/set uniform, it's necessary to use "initUniformsPerInstance".`);
  return this.uniformsTexture.getUniformAt(r, t, e);
};
d.prototype.setUniformAt = function(r, t, e) {
  if (!this.uniformsTexture)
    throw new Error(`Before get/set uniform, it's necessary to use "initUniformsPerInstance".`);
  this.uniformsTexture.setUniformAt(r, t, e), this.uniformsTexture.enqueueUpdate(r);
};
d.prototype.initUniformsPerInstance = function(r) {
  if (!this._parentLOD) {
    const { channels: t, pixelsPerInstance: e, uniformMap: s, fetchInFragmentShader: n } = this.getUniformSchemaResult(r);
    this.uniformsTexture = this._texturePool ? this._texturePool.acquire(Float32Array, t, e, this._capacity, s, n) : new W(Float32Array, t, e, this._capacity, s, n), this.materialsNeedsUpdate(), this.updatePropertiesKey();
  }
};
d.prototype.getUniformSchemaResult = function(r) {
  let t = 0;
  const e = /* @__PURE__ */ new Map(), s = [], n = r.vertex ?? {}, i = r.fragment ?? {};
  let o = !0;
  for (const l in n) {
    const f = n[l], p = this.getUniformSize(f);
    t += p, s.push({ name: l, type: f, size: p }), o = !1;
  }
  for (const l in i)
    if (!n[l]) {
      const f = i[l], p = this.getUniformSize(f);
      t += p, s.push({ name: l, type: f, size: p });
    }
  s.sort((l, f) => f.size - l.size);
  const a = [];
  for (const { name: l, size: f, type: p } of s) {
    const u = this.getUniformOffset(f, a);
    e.set(l, { offset: u, size: f, type: p });
  }
  const c = Math.ceil(t / 4);
  return { channels: Math.min(t, 4), pixelsPerInstance: c, uniformMap: e, fetchInFragmentShader: o };
};
d.prototype.getUniformOffset = function(r, t) {
  if (r < 4) {
    for (let s = 0; s < t.length; s++)
      if (t[s] + r <= 4) {
        const n = s * 4 + t[s];
        return t[s] += r, n;
      }
  }
  const e = t.length * 4;
  for (; r > 0; r -= 4)
    t.push(r);
  return e;
};
d.prototype.getUniformSize = function(r) {
  switch (r) {
    case "float":
      return 1;
    case "vec2":
      return 2;
    case "vec3":
      return 3;
    case "vec4":
      return 4;
    case "mat3":
      return 9;
    case "mat4":
      return 16;
    default:
      throw new Error(`Invalid uniform type: ${r}`);
  }
};
class Xt {
  constructor(t = 4, e = 32) {
    this._pool = /* @__PURE__ */ new Map(), this._totalPooled = 0, this.maxPerKey = t, this.maxTotal = e;
  }
  static _getKey(t, e, s, n) {
    return `${t.name}_${e}_${s}_${n}`;
  }
  /**
   * Acquire a texture from the pool or create a new one.
   * The returned texture's data is zeroed.
   */
  acquire(t, e, s, n, i, o) {
    const a = Xt._getKey(t, e, s, n), c = this._pool.get(a);
    if (c && c.length > 0) {
      const h = c.pop();
      return this._totalPooled--, i !== void 0 && (h._uniformMap = i), o !== void 0 && (h._fetchUniformsInFragmentShader = o), h;
    }
    return new W(t, e, s, n, i, o);
  }
  /**
   * Release a texture back into the pool. Its data is zeroed and update state reset.
   * If the pool is full, the texture is disposed instead.
   */
  release(t) {
    if (!t) return;
    const e = t._channels, s = t._pixelsPerInstance, n = t._data, i = n.constructor.name, o = t.image.width, a = o * o, c = Math.floor(a / s), h = `${i}_${e}_${s}_${c}`, l = this._pool.get(h);
    if ((l ? l.length : 0) >= this.maxPerKey || this._totalPooled >= this.maxTotal) {
      t.dispose();
      return;
    }
    n.fill(0), t._rowToUpdate.fill(!1), t._needsUpdate = !0, t.needsUpdate = !0, l ? l.push(t) : this._pool.set(h, [t]), this._totalPooled++;
  }
  /**
   * Dispose all pooled textures and clear the pool.
   */
  clear() {
    for (const t of this._pool.values())
      for (const e of t)
        e.dispose();
    this._pool.clear(), this._totalPooled = 0;
  }
}
var Ee = `#ifdef USE_INSTANCING_COLOR_INDIRECT
  uniform highp sampler2D colorsTexture;

  vec4 getColorTexture() {
    int size = textureSize( colorsTexture, 0 ).x;
    int j = int( instanceIndex );
    int x = j % size;
    int y = j / size;
    return texelFetch( colorsTexture, ivec2( x, y ), 0 );
  }
#endif`, Fe = `#ifdef USE_INSTANCING_COLOR_INDIRECT
  #ifdef USE_VERTEX_COLOR
    vColor = vec4( color );
  #else
    vColor = vec4( 1.0 );
  #endif
#endif`, De = `#ifdef USE_INSTANCING_INDIRECT
  attribute uint instanceIndex;
  uniform highp sampler2D matricesTexture;

  #ifdef USE_INSTANCING_SECTOR_INDIRECT
    #define PIXELS_PER_INSTANCE 6
  #else
    #define PIXELS_PER_INSTANCE 4
  #endif

  mat4 getInstancedMatrix() {
    int size = textureSize( matricesTexture, 0 ).x;
    int j = int( instanceIndex ) * PIXELS_PER_INSTANCE;
    int x = j % size;
    int y = j / size;
    vec4 v1 = texelFetch( matricesTexture, ivec2( x, y ), 0 );
    vec4 v2 = texelFetch( matricesTexture, ivec2( x + 1, y ), 0 );
    vec4 v3 = texelFetch( matricesTexture, ivec2( x + 2, y ), 0 );
    vec4 v4 = texelFetch( matricesTexture, ivec2( x + 3, y ), 0 );
    return mat4( v1, v2, v3, v4 );
  }
#endif`, Be = `#ifdef USE_INSTANCING_SECTOR_INDIRECT
  uniform ivec3 trackedSectorLow;
  uniform ivec3 trackedSectorHigh;
  uniform vec3 worldOffset;

  vec3 getSectorOffset() {
    int size = textureSize( matricesTexture, 0 ).x;
    int j = int( instanceIndex ) * 6;
    int x = j % size;
    int y = j / size;
    ivec3 sectorLow = floatBitsToInt( texelFetch( matricesTexture, ivec2( x + 4, y ), 0 ).rgb );
    vec3 sectorDelta = vec3( sectorLow - trackedSectorLow );
    return ( sectorDelta * 128.0 ) - worldOffset;
  }
#endif`, Ne = `#ifdef USE_INSTANCING_SECTOR_INDIRECT
  vec3 sectorOffset = getSectorOffset();
  
#endif`, ze = `#ifdef USE_SKINNING
  uniform mat4 bindMatrix;
  uniform mat4 bindMatrixInverse;
  uniform highp sampler2D boneTexture;

  #ifdef USE_INSTANCING_SKINNING
    uniform int bonesPerInstance;
  #endif

  mat4 getBoneMatrix( const in float i ) {
    int size = textureSize( boneTexture, 0 ).x;

    #ifdef USE_INSTANCING_SKINNING
      int j = ( bonesPerInstance * int( instanceIndex ) + int( i ) ) * 4;
    #else
      int j = int( i ) * 4;
    #endif

    int x = j % size;
    int y = j / size;
    vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
    vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
    vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
    vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
    return mat4( v1, v2, v3, v4 );
  }
#endif`, Re = `#ifdef USE_INSTANCING_INDIRECT
  mat4 instanceMatrix = getInstancedMatrix();

  #ifdef USE_INSTANCING_COLOR_INDIRECT
    vColor *= getColorTexture();
  #endif
#endif`;
x.instanced_pars_vertex = De;
x.instanced_color_pars_vertex = Ee;
x.instanced_vertex = Re;
x.instanced_color_vertex = Fe;
x.instanced_sector_pars_vertex = Be;
x.instanced_sector_vertex = Ne;
function vt(r) {
  return r.replace("#ifdef USE_INSTANCING", "#if defined USE_INSTANCING || defined USE_INSTANCING_INDIRECT");
}
x.project_vertex = vt(x.project_vertex);
x.worldpos_vertex = vt(x.worldpos_vertex);
x.defaultnormal_vertex = vt(x.defaultnormal_vertex);
x.batching_pars_vertex = x.batching_pars_vertex.concat(`
#include <instanced_pars_vertex>`).concat(`
#include <instanced_sector_pars_vertex>`);
x.color_pars_vertex = x.color_pars_vertex.concat(`
#include <instanced_color_pars_vertex>`);
x.batching_vertex = x.batching_vertex.concat(`
#include <instanced_vertex>`);
x.skinning_pars_vertex = ze;
x.morphinstance_vertex && (x.morphinstance_vertex = x.morphinstance_vertex.replaceAll(
  "gl_InstanceID",
  "instanceIndex"
));
function Ve(r, t = {}) {
  if (r.isSkinnedMesh) return e(r);
  if (r.isInstancedMesh) return s(r);
  return new d(r.geometry, r.material, t);
  function e(n) {
    const i = new d(n.geometry.clone(), n.material, t);
    return i.initSkeleton(n.skeleton), i;
  }
  function s(n) {
    t.capacity = Math.max(n.count, t.capacity);
    const i = n.geometry.clone();
    i.deleteAttribute("instanceIndex"), l();
    const o = new d(i, n.material, t);
    return o.position.copy(n.position), o.quaternion.copy(n.quaternion), o.scale.copy(n.scale), a(), c(), h(), o;
    function a() {
      o.setInstancesArrayCount(n.count), o._instancesCount = n.count, o.availabilityArray.fill(!0, 0, n.count * 2);
    }
    function c() {
      o.matricesTexture.image.data.set(n.instanceMatrix.array);
    }
    function h() {
      if (n.instanceColor) {
        o.initColorsTexture();
        const f = n.instanceColor.array, p = o.colorsTexture.image.data;
        for (let u = 0, m = 0; u < f.length; u += 3, m += 4)
          p[m] = f[u], p[m + 1] = f[u + 1], p[m + 2] = f[u + 2], p[m + 3] = 1;
      }
    }
    function l() {
      const f = i.attributes;
      for (const p in f)
        f[p].isInstancedBufferAttribute && console.warn(`InstancedBufferAttribute "${p}" is not supported. It will be ignored.`);
    }
  }
}
export {
  xe as GLInstancedBufferAttribute,
  $t as InstancedEntity,
  d as InstancedMesh2,
  _e as InstancedMeshBVH,
  Ce as InstancedRenderList,
  lt as Sector,
  W as SquareDataTexture,
  Xt as TexturePool,
  Ve as createInstancedMesh2From,
  Ge as createRadixSort,
  Se as getSquareTextureInfo,
  Gt as getSquareTextureSize,
  Ae as patchProperties,
  vt as patchShader,
  Vt as sortOpaque,
  qt as sortTransparent,
  Te as unpatchProperties
};
//# sourceMappingURL=index.js.map
