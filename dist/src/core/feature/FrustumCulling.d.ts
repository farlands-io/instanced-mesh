import { InstancedRenderItem } from "../utils/InstancedRenderList.js";
import { Camera, Matrix4 } from "three";
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
declare module "../InstancedMesh2.js" {
    interface InstancedMesh2 {
        /**
         * Performs frustum culling and manages LOD visibility.
         * @param camera The main camera used for rendering.
         * @param cameraLOD An optional camera for LOD calculations. Defaults to the main camera.
         * @param viewProjection Optional precomputed `projectionMatrix * matrixWorldInverse` to avoid
         *   recomputing per mesh when culling many meshes against the same camera in one frame.
         */
        performFrustumCulling(camera: Camera, cameraLOD?: Camera, viewProjection?: Matrix4): void;
    }
}
//# sourceMappingURL=FrustumCulling.d.ts.map