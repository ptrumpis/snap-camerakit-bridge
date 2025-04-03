import assert from 'assert';
import { BridgeError, MessageError, ProtocolError, MethodNotFoundError, CameraKitError, APITokenError, BootstrapError, LensError, LensGroupsError, LensMetadataError } from '../src/index.js';

describe('Serialization of BridgeError classes', function () {
    it('should correctly serialize and deserialize a BridgeError', () => {
        const error = new BridgeError('This is a bridge error', 'CustomBridgeError');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.strictEqual(deserializedError.message, 'This is a bridge error');
        assert.strictEqual(deserializedError.name, 'CustomBridgeError');
    });

    it('should serialize and deserialize MessageError correctly', () => {
        const error = new MessageError('This is a message error');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof MessageError);
        assert.strictEqual(deserializedError.message, 'This is a message error');
        assert.strictEqual(deserializedError.name, 'MessageError');
    });

    it('should serialize and deserialize ProtocolError correctly', () => {
        const error = new ProtocolError('Protocol error occurred');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof ProtocolError);
        assert.strictEqual(deserializedError.message, 'Protocol error occurred');
        assert.strictEqual(deserializedError.name, 'ProtocolError');
    });

    it('should serialize and deserialize MethodNotFoundError correctly', () => {
        const error = new MethodNotFoundError('Method not found');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof MethodNotFoundError);
        assert.strictEqual(deserializedError.message, 'Method not found');
        assert.strictEqual(deserializedError.name, 'MethodNotFoundError');
    });

    it('should serialize and deserialize CameraKitError correctly', () => {
        const error = new CameraKitError('CameraKit error');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof CameraKitError);
        assert.strictEqual(deserializedError.message, 'CameraKit error');
        assert.strictEqual(deserializedError.name, 'CameraKitError');
    });

    it('should serialize and deserialize APITokenError correctly', () => {
        const error = new APITokenError('API token error');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof APITokenError);
        assert.strictEqual(deserializedError.message, 'API token error');
        assert.strictEqual(deserializedError.name, 'APITokenError');
    });

    it('should serialize and deserialize BootstrapError correctly', () => {
        const error = new BootstrapError('Bootstrap error');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof BootstrapError);
        assert.strictEqual(deserializedError.message, 'Bootstrap error');
        assert.strictEqual(deserializedError.name, 'BootstrapError');
    });

    it('should serialize and deserialize LensError correctly', () => {
        const error = new LensError('Lens error');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof LensError);
        assert.strictEqual(deserializedError.message, 'Lens error');
        assert.strictEqual(deserializedError.name, 'LensError');
    });

    it('should serialize and deserialize LensGroupsError correctly', () => {
        const error = new LensGroupsError('Lens group error');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof LensGroupsError);
        assert.strictEqual(deserializedError.message, 'Lens group error');
        assert.strictEqual(deserializedError.name, 'LensGroupsError');
    });

    it('should serialize and deserialize LensMetadataError correctly', () => {
        const error = new LensMetadataError('Lens metadata error');
        const json = JSON.stringify(error);
        const deserializedError = BridgeError.fromJSON(json);

        assert.ok(deserializedError instanceof BridgeError);
        assert.ok(deserializedError instanceof LensMetadataError);
        assert.strictEqual(deserializedError.message, 'Lens metadata error');
        assert.strictEqual(deserializedError.name, 'LensMetadataError');
    });

    it('should throw error when deserializing unknown error class', () => {
        const invalidJson = JSON.stringify({
            _className: 'UnknownError',
            message: 'Unknown error'
        });

        assert.throws(() => {
            BridgeError.fromJSON(invalidJson);
        }, Error, 'Class "UnknownError" not found for deserialization.');
    });
});