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
            unlockable_id: lensId,
            group_id: lens.groupId || "",
            uuid: uuid,
            deeplink: deeplinkUrl || "",
            lens_name: (lens.name || "")?.trim(),
            user_display_name: (lens.lensCreator?.displayName || "")?.trim(),
            snapcode_url: lens.snapcode?.imageUrl || lens.scannable?.snapcodeImageUrl || SnapCameraFormatter.snapcodeUrl(uuid) || "",
            icon_url: lens.iconUrl || lens.content?.iconUrlBolt || lens.content?.iconUrl || "",
            thumbnail_media_url: lens.preview?.imageUrl || lens.content?.preview?.imageUrl || "",
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

        if (lens.content?.lnsUrl || lens.content?.lnsUrlBolt) {
            Object.assign(result, {
                lens_id: lensId || "",
                lens_url: lens.content?.lnsUrl || lens.content?.lnsUrlBolt || "",
                sha256: lens.content?.lnsSha256 || "",
            });
        }

        // additional info for accurate reversing
        if (typeof lens.isThirdParty === 'boolean' && lens.isThirdParty) {
            result.is_third_party = lens.isThirdParty;
        }

        if (typeof lens.cameraFacingPreference === 'number' && lens.cameraFacingPreference) {
            result.camera_facing_preference = lens.cameraFacingPreference;
        }

        if (lens.content?.iconUrl && lens.content.iconUrl !== result.icon_url) {
            result.icon_url_alt = lens.content.iconUrl;
        }

        return result;
    }

    static reverse(lens) {
        if (!lens) {
            return {};
        }

        const uuid = lens.uuid || SnapCameraFormatter.extractUuidFromDeeplink(lens.deeplink) || "";
        const lensId = lens.unlockable_id || lens.lens_id || "";
        const deeplinkUrl = lens.deeplink || SnapCameraFormatter.deeplinkUrl(uuid) || "";
        const snapcodeUrl = lens.snapcode_url || SnapCameraFormatter.snapcodeUrl(uuid) || "";

        const result = {
            id: lensId,
            name: lens.lens_name || "",
            groupId: lens.group_id || "",
            iconUrl: lens.icon_url || "",
            lensCreator: {
                displayName: lens.user_display_name || "",
            },
            snapcode: {
                deepLink: deeplinkUrl,
                imageUrl: snapcodeUrl,
            },
            scannable: {
                snapcodeDeeplink: deeplinkUrl,
                snapcodeImageUrl: snapcodeUrl,
            },
            content: undefined,
            preview: {
                imageUrl: lens.thumbnail_media_url || "",
            },
            cameraFacingPreference: lens.camera_facing_preference || 0,
            vendorData: {},
            featureMetadata: []
        };

        if (lens.is_third_party || lens.lens_url) {
            result.isThirdParty = (lens.is_third_party) ? true : false;
        }

        if (lens.lens_url) {
            result.content = {
                lnsUrl: lens.lens_url || "",
                lnsSha256: lens.sha256 || "",
                iconUrl: lens.icon_url_alt || lens.icon_url || "",
                preview: {
                    imageUrl: lens.thumbnail_media_url || "",
                    ...(lens.image_sequence ? {
                        imageSequenceWebpUrlPattern: lens.image_sequence.url_pattern || "",
                        imageSequenceSize: lens.image_sequence.size || 0,
                    } : {})
                },
                assetManifest: Array.isArray(lens.assets)
                    ? lens.assets.map(id => ({
                        id,
                        assetChecksum: "",
                        assetUrl: "",
                        requestTiming: 2,
                        type: 0,
                    }))
                    : [],
                defaultHintId: lens.hint_id || "",
                hintTranslations: {},
                lnsUrlBolt: lens.lens_url || "",
                iconUrlBolt: lens.icon_url || "",
            };
        } else {
            delete result.content;
            delete result.scannable;
        }

        return result;
    }
}

export { SnapCameraFormatter };
export default SnapCameraFormatter;
