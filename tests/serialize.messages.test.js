import assert from 'assert';
import { Message, CallMessage, DataMessage, ActionMessage, ErrorMessage, BridgeError, ReloadAction } from '../src/index.js';

describe('Serialization of Message classes', function () {
    it('should throw error when trying to instantiate the abstract Message class', () => {
        assert.throws(() => {
            new Message();
        }, Error, 'Cannot instantiate an abstract class Message directly!');
    });

    it('should serialize and deserialize CallMessage correctly', () => {
        const callMessage = new CallMessage('loadLens', ['lensId', 'groupId']);
        const json = JSON.stringify(callMessage);
        const deserializedCallMessage = Message.fromJSON(json);

        assert.ok(deserializedCallMessage instanceof Message);
        assert.ok(deserializedCallMessage instanceof CallMessage);
        assert.strictEqual(deserializedCallMessage.method, 'loadLens');
        assert.deepStrictEqual(deserializedCallMessage.params, ['lensId', 'groupId']);
    });

    it('should serialize and deserialize DataMessage correctly', () => {
        const dataMessage = new DataMessage('testData');
        const json = JSON.stringify(dataMessage);
        const deserializedDataMessage = Message.fromJSON(json);

        assert.ok(deserializedDataMessage instanceof Message);
        assert.ok(deserializedDataMessage instanceof DataMessage);
        assert.strictEqual(deserializedDataMessage.data, 'testData');
    });

    it('should serialize and deserialize ActionMessage correctly', () => {
        const action = new ReloadAction();
        const actionMessage = new ActionMessage(action);
        const json = JSON.stringify(actionMessage);
        const deserializedActionMessage = Message.fromJSON(json);

        assert.ok(deserializedActionMessage instanceof Message);
        assert.ok(deserializedActionMessage instanceof ActionMessage);
        assert.ok(deserializedActionMessage.action instanceof ReloadAction);
        assert.strictEqual(deserializedActionMessage.action.getCode(), action.getCode());
    });

    it('should serialize and deserialize ErrorMessage correctly', () => {
        const errorMessage = new ErrorMessage(new BridgeError('This is a test!'));
        const json = JSON.stringify(errorMessage);
        const deserializedErrorMessage = Message.fromJSON(json);

        assert.ok(deserializedErrorMessage instanceof Message);
        assert.ok(deserializedErrorMessage instanceof ErrorMessage);
        assert.strictEqual(deserializedErrorMessage.error.message, 'This is a test!');
    });

    it('should throw error for invalid deserialization of an unknown class', () => {
        const invalidJson = JSON.stringify({
            _className: 'UnknownClass',
            someProperty: 'value'
        });

        assert.throws(() => {
            Message.fromJSON(invalidJson);
        }, Error, 'Class "UnknownClass" not found for deserialization.');
    });
});
