import { bootstrapCameraKit } from '@snap/camera-kit';
import { CameraKitError, APITokenError, BootstrapError, LensGroupsError, LensMetadataError } from '../common/errors.js';

class CameraKitWeb {
    #cameraKit
    #apiToken;

    constructor() {
    }

    async init(apiToken) {
        if (typeof apiToken !== 'string' || !apiToken.trim()) {
            throw new APITokenError('Invalid API token');
        }

        try {
            this.#apiToken = apiToken;
            this.#cameraKit = await bootstrapCameraKit({ apiToken: this.#apiToken });
            return true;
        } catch (e) {
            throw new BootstrapError(e.message);
        }
    }

    async loadLens(lensId, groupId, withMeta = true) {
        if (!this.#cameraKit) {
            throw new CameraKitError('CameraKit is not initialized!');
        }

        let lens = null;
        try {
            lens = await this.#cameraKit.lensRepository.loadLens(lensId, groupId) || null;
        } catch (e) {
            throw new LensError(e.message);
        }

        if (withMeta && lens?.id) {
            const lensMeta = await this.getLensMetadata(lens.id);
            return { ...lensMeta, ...lens };
        }

        return lens;
    }

    async loadLensGroup(groupId, withMeta = true) {
        if (!this.#cameraKit) {
            throw new CameraKitError('CameraKit is not initialized!');
        }

        let lenses = [];
        try {
            const result = await this.#cameraKit.lensRepository.loadLensGroups(Array.isArray(groupId) ? groupId : [groupId]);
            lenses = result?.lenses || [];
        } catch (e) {
            throw new LensGroupsError(e.message);
        }

        if (withMeta) {
            return await Promise.all(lenses.map(async (lens) => {
                const lensMeta = await this.getLensMetadata(lens.id);
                return { ...lensMeta, ...lens };
            }));
        }

        return lenses;
    }

    async getLensMetadata(lensId) {
        if (!this.#cameraKit) {
            throw new CameraKitError('CameraKit is not initialized!');
        }

        try {
            return this.#cameraKit.lensRepository.getLensMetadata(lensId);
        } catch (e) {
            throw new LensMetadataError(e.message);
        }
    }
}

export { CameraKitWeb };
export default CameraKitWeb;
