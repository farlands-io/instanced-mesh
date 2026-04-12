import { SquareDataTexture } from './SquareDataTexture.js';
import type { ChannelSize, TypedArrayConstructor, UniformMap } from './SquareDataTexture.js';

/**
 * Pools `SquareDataTexture` instances to avoid GPU memory churn
 * when InstancedMesh2 objects are frequently created and destroyed.
 */
export class TexturePool {
  private _pool = new Map<string, SquareDataTexture[]>();
  private _totalPooled = 0;

  /**
   * Maximum number of textures pooled per key.
   * @default 4
   */
  public maxPerKey: number;

  /**
   * Maximum total number of textures in the pool.
   * @default 32
   */
  public maxTotal: number;

  constructor(maxPerKey = 4, maxTotal = 32) {
    this.maxPerKey = maxPerKey;
    this.maxTotal = maxTotal;
  }

  private static _getKey(arrayType: TypedArrayConstructor, channels: ChannelSize, pixelsPerInstance: number, capacity: number): string {
    // The square size is deterministic from capacity + pixelsPerInstance,
    // so we include capacity to match exact buffer sizes.
    return `${arrayType.name}_${channels}_${pixelsPerInstance}_${capacity}`;
  }

  /**
   * Acquire a texture from the pool or create a new one.
   * The returned texture's data is zeroed.
   */
  public acquire(
    arrayType: TypedArrayConstructor,
    channels: ChannelSize,
    pixelsPerInstance: number,
    capacity: number,
    uniformMap?: UniformMap,
    fetchInFragmentShader?: boolean,
  ): SquareDataTexture {
    const key = TexturePool._getKey(arrayType, channels, pixelsPerInstance, capacity);
    const bucket = this._pool.get(key);

    if (bucket && bucket.length > 0) {
      const texture = bucket.pop()!;
      this._totalPooled--;

      // Restore uniform metadata if needed
      if (uniformMap !== undefined) {
        (texture as any)._uniformMap = uniformMap;
      }
      if (fetchInFragmentShader !== undefined) {
        (texture as any)._fetchUniformsInFragmentShader = fetchInFragmentShader;
      }

      return texture;
    }

    return new SquareDataTexture(arrayType, channels, pixelsPerInstance, capacity, uniformMap, fetchInFragmentShader);
  }

  /**
   * Release a texture back into the pool. Its data is zeroed and update state reset.
   * If the pool is full, the texture is disposed instead.
   */
  public release(texture: SquareDataTexture): void {
    if (!texture) return;

    const channels = (texture as any)._channels as ChannelSize;
    const pixelsPerInstance = (texture as any)._pixelsPerInstance as number;
    const data = texture._data;
    const arrayTypeName = data.constructor.name;

    // Reconstruct capacity from texture dimensions
    const size = texture.image.width;
    const totalPixels = size * size;
    const capacity = Math.floor(totalPixels / pixelsPerInstance);

    const key = `${arrayTypeName}_${channels}_${pixelsPerInstance}_${capacity}`;

    // Check limits
    const bucket = this._pool.get(key);
    const bucketSize = bucket ? bucket.length : 0;

    if (bucketSize >= this.maxPerKey || this._totalPooled >= this.maxTotal) {
      texture.dispose();
      return;
    }

    // Zero the data and reset update state
    data.fill(0);
    (texture as any)._rowToUpdate.fill(false);
    (texture as any)._needsUpdate = true;
    texture.needsUpdate = true;

    if (!bucket) {
      this._pool.set(key, [texture]);
    } else {
      bucket.push(texture);
    }
    this._totalPooled++;
  }

  /**
   * Dispose all pooled textures and clear the pool.
   */
  public clear(): void {
    for (const bucket of this._pool.values()) {
      for (const texture of bucket) {
        texture.dispose();
      }
    }
    this._pool.clear();
    this._totalPooled = 0;
  }
}
