class LensFormatter {
    constructor() {
        if (new.target === LensFormatter) {
            throw new Error('Cannot instantiate an abstract class LensFormatter directly!');
        }
    }

    static format(lens) {
        throw new Error('Cannot call abstract method format() directly!');
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

export { LensFormatter };
export default LensFormatter;
