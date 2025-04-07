import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import DefaultExport from '../src/common/errors.js';
import * as Module from '../src/common/errors.js';

describe('Default Export: /errors', () => {
    it('should be an object', () => {
        assert.ok(typeof DefaultExport === 'object');
    });

    it('should export all Error classes', () => {
        assert.ok(typeof DefaultExport.BridgeError === 'function');
        assert.ok(typeof DefaultExport.CameraKitError === 'function');
        assert.ok(typeof DefaultExport.MessageError === 'function');
        assert.ok(typeof DefaultExport.ProtocolError === 'function');
        assert.ok(typeof DefaultExport.MethodNotFoundError === 'function');
        assert.ok(typeof DefaultExport.APITokenError === 'function');
        assert.ok(typeof DefaultExport.BootstrapError === 'function');
        assert.ok(typeof DefaultExport.LensError === 'function');
        assert.ok(typeof DefaultExport.LensGroupsError === 'function');
        assert.ok(typeof DefaultExport.LensMetadataError === 'function');
    });
});

describe('Named Exports: /errors', () => {
    it('should export all Error classes', () => {
        assert.equal(typeof Module.BridgeError, 'function');
        assert.equal(typeof Module.CameraKitError, 'function');
        assert.equal(typeof Module.MessageError, 'function');
        assert.equal(typeof Module.ProtocolError, 'function');
        assert.equal(typeof Module.MethodNotFoundError, 'function');
        assert.equal(typeof Module.APITokenError, 'function');
        assert.equal(typeof Module.BootstrapError, 'function');
        assert.equal(typeof Module.LensError, 'function');
        assert.equal(typeof Module.LensGroupsError, 'function');
        assert.equal(typeof Module.LensMetadataError, 'function');
    });
});