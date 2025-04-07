import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import DefaultExport from '../src/common/actions.js';
import * as Module from '../src/common/actions.js';

describe('Default Export: /actions', () => {
    it('should be an object', () => {
        assert.ok(typeof DefaultExport === 'object');
    });

    it('should export all Action classes', () => {
        assert.ok(typeof DefaultExport.Action === 'function');
        assert.ok(typeof DefaultExport.ResetAction === 'function');
        assert.ok(typeof DefaultExport.ReloadAction === 'function');
    });
});

describe('Named Exports: /actions', () => {
    it('should export all Action classes', () => {
        assert.equal(typeof Module.Action, 'function');
        assert.equal(typeof Module.ResetAction, 'function');
        assert.equal(typeof Module.ReloadAction, 'function');
    });
});