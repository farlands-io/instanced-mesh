import { SquareDataTexture } from './SquareDataTexture.js';
import type { ChannelSize, TypedArrayConstructor, UniformMap } from './SquareDataTexture.js';
/**
 * Pools `SquareDataTexture` instances to avoid GPU memory churn
 * when InstancedMesh2 objects are frequently created and destroyed.
 */
export declare class TexturePool {
    private _pool;
    private _totalPooled;
    /**
     * Maximum number of textures pooled per key.
     * @default 4
     */
    maxPerKey: number;
    /**
     * Maximum total number of textures in the pool.
     * @default 32
     */
    maxTotal: number;
    constructor(maxPerKey?: number, maxTotal?: number);
    private static _getKey;
    /**
     * Acquire a texture from the pool or create a new one.
     * The returned texture's data is zeroed.
     */
    acquire(arrayType: TypedArrayConstructor, channels: ChannelSize, pixelsPerInstance: number, capacity: number, uniformMap?: UniformMap, fetchInFragmentShader?: boolean): SquareDataTexture;
    /**
     * Release a texture back into the pool. Its data is zeroed and update state reset.
     * If the pool is full, the texture is disposed instead.
     */
    release(texture: SquareDataTexture): void;
    /**
     * Dispose all pooled textures and clear the pool.
     */
    clear(): void;
}
//# sourceMappingURL=TexturePool.d.ts.map