import assert from 'assert';
import { Action, ReloadAction, ResetAction } from '../src/index.js';

describe('Serialization of Action classes', function () {
    it('should throw error when trying to instantiate the abstract Action class', () => {
        assert.throws(() => {
            new Action('some code');
        }, Error, 'Cannot instantiate an abstract class Action directly!');
    });

    it('should serialize and deserialize ResetAction correctly', () => {
        const resetAction = new ResetAction();
        const json = JSON.stringify(resetAction);
        const deserializedResetAction = Action.fromJSON(json);

        assert.ok(deserializedResetAction instanceof Action);
        assert.ok(deserializedResetAction instanceof ResetAction);
        assert.strictEqual(deserializedResetAction.getCode(), resetAction.getCode());
    });

    it('should serialize and deserialize ReloadAction correctly', () => {
        const reloadAction = new ReloadAction();
        const json = JSON.stringify(reloadAction);
        const deserializedReloadAction = Action.fromJSON(json);

        assert.ok(deserializedReloadAction instanceof Action);
        assert.ok(deserializedReloadAction instanceof ReloadAction);
        assert.strictEqual(deserializedReloadAction.getCode(), reloadAction.getCode());
    });

    it('should throw error for unknown Action during deserialization', () => {
        const invalidJson = JSON.stringify({
            _className: 'UnknownAction',
            someProperty: 'value'
        });

        assert.throws(() => {
            Action.fromJSON(invalidJson);
        }, Error, 'Class "UnknownAction" not found for deserialization.');
    });
});