import { InstancedMesh2 } from "./InstancedMesh2.js";
import { UniformValue, UniformValueObj } from "./utils/SquareDataTexture.js";
import { Color, ColorRepresentation, Euler, Matrix4, Mesh, Object3D, Quaternion, Vector3 } from "three";
/**
 * Represents a 3D sector coordinate with int64 precision.
 * Sectors are stored as BigInt values to support the full int64 range.
 */
export declare class Sector {
    x: bigint;
    y: bigint;
    z: bigint;
    /**
     * Sets the sector coordinates.
     * @param x The X coordinate.
     * @param y The Y coordinate.
     * @param z The Z coordinate.
     * @returns This sector instance for chaining.
     */
    set(x: bigint, y: bigint, z: bigint): this;
    /**
     * Copies values from another Sector instance.
     * @param sector The sector to copy from.
     * @returns This sector instance for chaining.
     */
    copy(sector: Sector): this;
    /**
     * Creates a clone of this sector.
     * @returns A new Sector instance with the same values.
     */
    clone(): Sector;
    /**
     * Converts this sector to an array.
     * @param array Optional array to write values into.
     * @param offset Starting offset in the array.
     * @returns The array containing the sector values.
     */
    toArray(array?: bigint[], offset?: number): bigint[];
    /**
     * Sets this sector from an array.
     * @param array The array to read values from.
     * @param offset Starting offset in the array.
     * @returns This sector instance for chaining.
     */
    fromArray(array: bigint[], offset?: number): this;
}
/**
 * Represents an instance in an `InstancedMesh2`.
 * This class stores transformation data (position, rotation, scale) and provides methods to manipulate them.
 */
export declare class InstancedEntity {
    /**
     * Indicates if this is an `InstancedEntity`.
     */
    readonly isInstanceEntity = true;
    /**
     * The unique identifier for this instance (relative to the `InstancedMesh2` it references).
     */
    readonly id: number;
    /**
     * `InstancedMesh2` to which this instance refers.
     */
    readonly owner: InstancedMesh2;
    /**
     * The local position.
     */
    position: Vector3;
    /**
     * The local scale.
     */
    scale: Vector3;
    /**
     * The local rotation as `Quaternion`.
     */
    quaternion: Quaternion;
    /**
     * The local rotation as `Euler`.
     * This works only if `allowsEuler` is set to `true` in the `InstancedMesh2` constructor parameters.
     */
    rotation: Euler;
    /**
     * The visibility state set and got from `owner.availabilityArray`.
     */
    get visible(): boolean;
    set visible(value: boolean);
    /**
     * The availability set and got from `owner.availabilityArray`.
     */
    get active(): boolean;
    set active(value: boolean);
    /**
     * Color set and got from `owner.colorsTexture`.
     */
    get color(): Color;
    set color(value: ColorRepresentation);
    /**
     * Opacity set and got from `owner.colorsTexture`.
     */
    get opacity(): number;
    set opacity(value: number);
    /**
     * Sector coordinate set in the owner's matricesTexture.
     */
    setSector(x: bigint, y: bigint, z: bigint): void;
    /**
     * Morph target influences set and got from `owner.morphTexture`.
     */
    get morph(): Mesh;
    set morph(value: Mesh);
    /**
     * The local transform matrix got from `owner.matricesTexture`.
     */
    get matrix(): Matrix4;
    /**
     * The world transform matrix got by multiplying the matrix got from `owner.matricesTexture` and `this.owner.matrixWorld`.
     */
    get matrixWorld(): Matrix4;
    /**
     * This object is instantiated automatically by setting `createEntities` to `true` in the `InstancedMesh2` constructor parameters.
     * Dont instantiate this manually.
     * @param owner The `InstancedMesh2` that owns this instance.
     * @param id The unique identifier for this instance within the `InstancedMesh2`.
     * @param useEuler Whether to use Euler rotations in addition to quaternion rotations.
     */
    constructor(owner: InstancedMesh2, id: number, useEuler: boolean);
    /**
     * Updates the transformation matrix with its current position, quaternion, and scale.
     * The updated matrix is stored in the `owner.matricesTexture`.
     */
    updateMatrix(): void;
    /**
     * Updates only the position component of the transformation matrix.
     * This is useful if only position changes, avoiding recalculating the full matrix.
     * The updated matrix is stored in the `owner.matricesTexture`.
     */
    updateMatrixPosition(): void;
    /**
     * Retrieves the uniform value associated with the given name.
     * @param name The name of the uniform to retrieve.
     * @param target Optional target object where the uniform value will be written.
     * @returns The retrieved uniform value.
     */
    getUniform(name: string, target?: UniformValueObj): UniformValue;
    /**
     * Updates the bones of the skeleton to the instance.
     * @param updateBonesMatrices Whether to update the matrices of the bones. Default is `true`.
     * @param excludeBonesSet An optional set of bone names to exclude from updates, skipping their local matrix updates.
     */
    updateBones(updateBonesMatrices?: boolean, excludeBonesSet?: Set<string>): void;
    /**
     * Sets the uniform value for the given name
     * @param name The name of the uniform to set.
     * @param value The new value for the uniform.
     */
    setUniform(name: string, value: UniformValue): void;
    /**
     * Copies the transformation properties (`position`, `scale`, `quaternion`) of this instance to the specified `Object3D`.
     * @param target The `Object3D` where the transformation properties will be copied.
     */
    copyTo(target: Object3D): void;
    /**
     * Applies the matrix transform to the object and updates the object's position, rotation and scale.
     * @param m The matrix to apply.
     * @returns The instance of the object.
     */
    applyMatrix4(m: Matrix4): this;
    /**
     * Applies the rotation represented by the quaternion to the object.
     * @param q The quaternion representing the rotation to apply.
     * @returns The instance of the object.
     */
    applyQuaternion(q: Quaternion): this;
    /**
     * Rotate an object along an axis in object space. The axis is assumed to be normalized.
     * @param axis A normalized vector in object space.
     * @param angle The angle in radians.
     * @returns The instance of the object.
     */
    rotateOnAxis(axis: Vector3, angle: number): this;
    /**
     * Rotate an object along an axis in world space. The axis is assumed to be normalized. Method Assumes no rotated parent.
     * @param axis A normalized vector in world space.
     * @param angle The angle in radians.
     * @returns The instance of the object.
     */
    rotateOnWorldAxis(axis: Vector3, angle: number): this;
    /**
     * Rotates the object around x axis in local space.
     * @param angle The angle to rotate in radians.
     * @returns The instance of the object.
     */
    rotateX(angle: number): this;
    /**
     * Rotates the object around y axis in local space.
     * @param angle The angle to rotate in radians.
     * @returns The instance of the object.
     */
    rotateY(angle: number): this;
    /**
     * Rotates the object around z axis in local space.
     * @param angle The angle to rotate in radians.
     * @returns The instance of the object.
     */
    rotateZ(angle: number): this;
    /**
     * Translate an object by distance along an axis in object space. The axis is assumed to be normalized.
     * @param axis A normalized vector in object space.
     * @param distance The distance to translate.
     * @returns The instance of the object.
     */
    translateOnAxis(axis: Vector3, distance: number): this;
    /**
     * Translates object along x axis in object space by distance units.
     * @param distance The distance to translate.
     * @returns The instance of the object.
     */
    translateX(distance: number): this;
    /**
     * Translates object along y axis in object space by distance units.
     * @param distance The distance to translate.
     * @returns The instance of the object.
     */
    translateY(distance: number): this;
    /**
     * Translates object along z axis in object space by distance units.
     * @param distance The distance to translate.
     * @returns The instance of the object.
     */
    translateZ(distance: number): this;
    /**
     * Removes this entity from its owner instance.
     * @returns The instance of the object.
     */
    remove(): this;
}
//# sourceMappingURL=InstancedEntity.d.ts.map