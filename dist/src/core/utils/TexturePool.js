import { SquareDataTexture } from './SquareDataTexture.js';
/**
 * Pools `SquareDataTexture` instances to avoid GPU memory churn
 * when InstancedMesh2 objects are frequently created and destroyed.
 */
export class TexturePool {
    constructor(maxPerKey = 4, maxTotal = 32) {
        this._pool = new Map();
        this._totalPooled = 0;
        this.maxPerKey = maxPerKey;
        this.maxTotal = maxTotal;
    }
    static _getKey(arrayType, channels, pixelsPerInstance, capacity) {
        // The square size is deterministic from capacity + pixelsPerInstance,
        // so we include capacity to match exact buffer sizes.
        return `${arrayType.name}_${channels}_${pixelsPerInstance}_${capacity}`;
    }
    /**
     * Acquire a texture from the pool or create a new one.
     * The returned texture's data is zeroed.
     */
    acquire(arrayType, channels, pixelsPerInstance, capacity, uniformMap, fetchInFragmentShader) {
        const key = TexturePool._getKey(arrayType, channels, pixelsPerInstance, capacity);
        const bucket = this._pool.get(key);
        if (bucket && bucket.length > 0) {
            const texture = bucket.pop();
            this._totalPooled--;
            // Restore uniform metadata if needed
            if (uniformMap !== undefined) {
                texture._uniformMap = uniformMap;
            }
            if (fetchInFragmentShader !== undefined) {
                texture._fetchUniformsInFragmentShader = fetchInFragmentShader;
            }
            return texture;
        }
        return new SquareDataTexture(arrayType, channels, pixelsPerInstance, capacity, uniformMap, fetchInFragmentShader);
    }
    /**
     * Release a texture back into the pool. Its data is zeroed and update state reset.
     * If the pool is full, the texture is disposed instead.
     */
    release(texture) {
        if (!texture)
            return;
        const channels = texture._channels;
        const pixelsPerInstance = texture._pixelsPerInstance;
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
        texture._rowToUpdate.fill(false);
        texture._needsUpdate = true;
        texture.needsUpdate = true;
        if (!bucket) {
            this._pool.set(key, [texture]);
        }
        else {
            bucket.push(texture);
        }
        this._totalPooled++;
    }
    /**
     * Dispose all pooled textures and clear the pool.
     */
    clear() {
        for (const bucket of this._pool.values()) {
            for (const texture of bucket) {
                texture.dispose();
            }
        }
        this._pool.clear();
        this._totalPooled = 0;
    }
}
//# sourceMappingURL=TexturePool.js.map