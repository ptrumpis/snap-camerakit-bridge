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

    async loadLensGroup(groupId, withMeta = true) {
        if (!this.#cameraKit) {
            throw new CameraKitError('CameraKit is not initialized!');
        }

        let lenses = [];
        try {
            const result = await this.#cameraKit.lensRepository.loadLensGroups([groupId]);
            lenses = result?.lenses || [];
        } catch (e) {
            throw new LensGroupsError(e.message);
        }

        if (withMeta) {
            lenses = await Promise.all(lenses.map(async (lens) => {
                const lensMeta = await this.getLensMetadata(lens.id);
                return CameraKitWeb.formatLens({ ...lensMeta, ...lens });
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

    static formatLens(lens) {
        if (!lens) {
            return {};
        }

        const lensId = lens.id || "";
        const deeplinkUrl = lens.snapcode?.deepLink || lens.scannable?.snapcodeDeeplink || "";
        const uuid = CameraKitWeb.extractUuidFromDeeplink(deeplinkUrl) || "";

        let result = {
            lens_id: lensId || "",
            unlockable_id: lensId,
            group_id: lens.groupId || "",
            uuid: uuid,
            deeplink: deeplinkUrl || "",
            lens_name: (lens.name || "")?.trim(),
            user_display_name: (lens.lensCreator?.displayName || "")?.trim(),
            snapcode_url: lens.snapcode?.imageUrl || lens.scannable?.snapcodeImageUrl || CameraKitWeb.snapcodeUrl(uuid) || "",
            icon_url: lens.iconUrl || lens.content?.iconUrl || lens.content?.iconUrlBolt || "",
            lens_url: lens.content?.lnsUrl || lens.content?.lnsUrlBolt || "",
            sha256: lens.content?.lnsSha256 || "",
            thumbnail_media_url: lens.preview?.imageUrl || lens.content?.preview?.imageUrl || lens.previewImageUrl || lens.lensPreviewImageUrl || "",
            hint_id: lens.content?.defaultHintId || "",
        };

        if (lens.content?.preview && typeof lens.content.preview === 'object' && Object.keys(lens.content.preview).length) {
            result.image_sequence = {
                url_pattern: lens.content.preview?.imageSequenceWebpUrlPattern || "",
                size: lens.content.preview?.imageSequenceSize || 0,
                frame_interval_ms: 300,
            }
        }

        if (Array.isArray(lens.content?.assetManifest) && lens.content.assetManifest.length) {
            result.assets = lens.content.assetManifest.map((manifest) => {
                return manifest.id;
            });
        }

        return result;
    }

    static snapcodeUrl(uuid) {
        if (typeof uuid === 'string' && uuid) {
            return `https://app.snapchat.com/web/deeplink/snapcode?data=${uuid}&version=1&type=png`;
        }
        return '';
    }

    static deeplinkUrl(uuid) {
        if (typeof uuid === 'string' && uuid) {
            return `https://snapchat.com/unlock/?type=SNAPCODE&uuid=${uuid}&metadata=01`;
        }
        return '';
    }

    static extractUuidFromDeeplink(deeplink) {
        try {
            if (typeof deeplink === 'string' && deeplink && (deeplink.startsWith("https://www.snapchat.com/unlock/?") || deeplink.startsWith("https://snapchat.com/unlock/?"))) {
                let deeplinkURL = new URL(deeplink);
                const regexExp = /^[a-f0-9]{32}$/gi;
                if (regexExp.test(deeplinkURL.searchParams.get('uuid'))) {
                    return deeplinkURL.searchParams.get('uuid');
                }
            }
        } catch (e) { }

        return '';
    }
}

export { CameraKitWeb };
export default CameraKitWeb;
