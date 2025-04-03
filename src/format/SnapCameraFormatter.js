import LensFormatter from "./LensFormatter.js";

class SnapCameraFormatter extends LensFormatter {
    static format(lens) {
        if (!lens) {
            return {};
        }

        const lensId = lens.id || "";
        const deeplinkUrl = lens.snapcode?.deepLink || lens.scannable?.snapcodeDeeplink || "";
        const uuid = SnapCameraFormatter.extractUuidFromDeeplink(deeplinkUrl) || "";

        let result = {
            lens_id: lensId || "",
            unlockable_id: lensId,
            group_id: lens.groupId || "",
            uuid: uuid,
            deeplink: deeplinkUrl || "",
            lens_name: (lens.name || "")?.trim(),
            user_display_name: (lens.lensCreator?.displayName || "")?.trim(),
            snapcode_url: lens.snapcode?.imageUrl || lens.scannable?.snapcodeImageUrl || SnapCameraFormatter.snapcodeUrl(uuid) || "",
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
}

export { SnapCameraFormatter };
export default SnapCameraFormatter;
