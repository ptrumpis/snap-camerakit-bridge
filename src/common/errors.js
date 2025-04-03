import { Serializable } from "./serialize.js";

class BridgeError extends Serializable(Error) {
    constructor(message, name = null) {
        super(message);
        this.name = name || this.constructor.name;
    }

    static isBridgeError(value) {
        return value instanceof BridgeError;
    }

    toJSON() {
        return {
            message: this.message,
            name: this.name,
            stack: this.stack,
            ...super.toJSON()
        };
    }
}

class MessageError extends BridgeError { }
class ProtocolError extends MessageError { }
class MethodNotFoundError extends MessageError { }
class CameraKitError extends BridgeError { }
class APITokenError extends CameraKitError { }
class BootstrapError extends CameraKitError { }
class LensError extends CameraKitError { }
class LensGroupsError extends CameraKitError { }
class LensMetadataError extends CameraKitError { }

BridgeError
    .register(BridgeError)
    .register(MessageError)
    .register(ProtocolError)
    .register(MethodNotFoundError)
    .register(CameraKitError)
    .register(APITokenError)
    .register(BootstrapError)
    .register(LensError)
    .register(LensGroupsError)
    .register(LensMetadataError);

export { BridgeError, CameraKitError, MessageError, ProtocolError, MethodNotFoundError, APITokenError, BootstrapError, LensError, LensGroupsError, LensMetadataError };
export default { BridgeError, CameraKitError, MessageError, ProtocolError, MethodNotFoundError, APITokenError, BootstrapError, LensError, LensGroupsError, LensMetadataError };
