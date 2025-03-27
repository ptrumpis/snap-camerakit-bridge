class BridgeError extends Error {
    static registry = new Map();

    constructor(message, name = null) {
        super(message);
        this.name = name || this.constructor.name;
    }

    toString() {
        return `[${this.constructor.name}]`;
    }

    toJSON() {
        return {
            ...this,
            className: this.constructor.name
        };
    }

    static fromJSON(json) {
        const { className, ...rest } = json;

        if (!className) {
            throw new Error(`Missing className in JSON.`);
        }

        const errorClass = BridgeError.registry.get(className);
        if (!errorClass) {
            throw new Error(`Class "${className}" not found for deserialization.`);
        }

        if (!(errorClass.prototype instanceof BridgeError)) {
            throw new Error(`Class "${className}" is not a valid BridgeError class.`);
        }

        const instance = new errorClass(rest.message, rest.name);
        Object.assign(instance, rest);
        return instance;
    }
}
registerMessageClass(BridgeError);

class MessageError extends BridgeError { }
registerMessageClass(MessageError);

class MethodNotFoundError extends MessageError { }
registerMessageClass(MethodNotFoundError);

class CameraKitError extends BridgeError { }
registerMessageClass(CameraKitError);

class APITokenError extends CameraKitError { }
registerMessageClass(APITokenError);

class BootstrapError extends CameraKitError { }
registerMessageClass(BootstrapError);

class LensGroupsError extends CameraKitError { }
registerMessageClass(LensGroupsError);

class LensMetadataError extends CameraKitError { }
registerMessageClass(LensMetadataError);

function registerMessageClass(cls) {
    BridgeError.registry.set(cls.name, cls);
}

export { BridgeError, CameraKitError, MessageError, MethodNotFoundError, APITokenError, BootstrapError, LensGroupsError, LensMetadataError };
export default { BridgeError, CameraKitError, MessageError, MethodNotFoundError, APITokenError, BootstrapError, LensGroupsError, LensMetadataError };
