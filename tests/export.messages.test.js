import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import DefaultExport from '../src/index.js';
import * as Module from '../src/index.js';

describe('Default Export: /messages', () => {
    it('should be an object', () => {
        assert.ok(typeof DefaultExport === 'object');
    });

    it('should export all Message classes', () => {
        assert.ok(typeof DefaultExport.Message === 'function');
        assert.ok(typeof DefaultExport.ActionMessage === 'function');
        assert.ok(typeof DefaultExport.CallMessage === 'function');
        assert.ok(typeof DefaultExport.DataMessage === 'function');
        assert.ok(typeof DefaultExport.ErrorMessage === 'function');
    });
});

describe('Named Exports: /messages', () => {
    it('should export all Message classes', () => {
        assert.equal(typeof Module.Message, 'function');
        assert.equal(typeof Module.ActionMessage, 'function');
        assert.equal(typeof Module.CallMessage, 'function');
        assert.equal(typeof Module.DataMessage, 'function');
        assert.equal(typeof Module.ErrorMessage, 'function');
    });
});