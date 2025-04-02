import { Serializable } from "./serialize.js";

class BridgeError extends Serializable(Error) {
    constructor(message, name = null) {
        super(message);
        this.name = name || this.constructor.name;
    }

    static isBridgeError(value) {
        return value instanceof BridgeError;
    }
}

class MessageError extends BridgeError { }
class MethodNotFoundError extends MessageError { }
class CameraKitError extends BridgeError { }
class APITokenError extends CameraKitError { }
class BootstrapError extends CameraKitError { }
class LensError extends CameraKitError { }
class LensGroupsError extends CameraKitError { }
class LensMetadataError extends CameraKitError { }

BridgeError.register(BridgeError);
CameraKitError.register(CameraKitError);
MessageError.register(MessageError);
MethodNotFoundError.register(MethodNotFoundError);
APITokenError.register(APITokenError);
BootstrapError.register(BootstrapError);
LensError.register(LensError);
LensGroupsError.register(LensGroupsError);
LensMetadataError.register(LensMetadataError);

export { BridgeError, CameraKitError, MessageError, MethodNotFoundError, APITokenError, BootstrapError, LensError, LensGroupsError, LensMetadataError };
export default { BridgeError, CameraKitError, MessageError, MethodNotFoundError, APITokenError, BootstrapError, LensError, LensGroupsError, LensMetadataError };
