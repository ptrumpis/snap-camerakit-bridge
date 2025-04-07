import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import DefaultExport from '../src/index.js';
import * as Module from '../src/index.js';

describe('Default Export', () => {
    it('should be an object', () => {
        assert.ok(typeof DefaultExport === 'object');
    });

    it('should export all CameraKit classes', () => {
        assert.ok(typeof DefaultExport.CameraKitBridge === 'function');
        assert.ok(typeof DefaultExport.CameraKitClient === 'function');
        assert.ok(typeof DefaultExport.CameraKitServer === 'function');
    });

    it('should export all Formatter classes', () => {
        assert.ok(typeof DefaultExport.LensFormatter === 'function');
        assert.ok(typeof DefaultExport.OriginalFormatter === 'function');
        assert.ok(typeof DefaultExport.SnapCameraFormatter === 'function');
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

    it('should export all Message classes', () => {
        assert.ok(typeof DefaultExport.Message === 'function');
        assert.ok(typeof DefaultExport.ActionMessage === 'function');
        assert.ok(typeof DefaultExport.CallMessage === 'function');
        assert.ok(typeof DefaultExport.DataMessage === 'function');
        assert.ok(typeof DefaultExport.ErrorMessage === 'function');
    });

    it('should export all Action classes', () => {
        assert.ok(typeof DefaultExport.Action === 'function');
        assert.ok(typeof DefaultExport.ResetAction === 'function');
        assert.ok(typeof DefaultExport.ReloadAction === 'function');
    });
});

describe('Named Exports', () => {
    it('should export all CameraKit classes', () => {
        assert.equal(typeof Module.CameraKitBridge, 'function');
        assert.equal(typeof Module.CameraKitClient, 'function');
        assert.equal(typeof Module.CameraKitServer, 'function');
    });

    it('should export all Formatter classes', () => {
        assert.equal(typeof Module.LensFormatter, 'function');
        assert.equal(typeof Module.OriginalFormatter, 'function');
        assert.equal(typeof Module.SnapCameraFormatter, 'function');
    });

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

    it('should export all Message classes', () => {
        assert.equal(typeof Module.Message, 'function');
        assert.equal(typeof Module.ActionMessage, 'function');
        assert.equal(typeof Module.CallMessage, 'function');
        assert.equal(typeof Module.DataMessage, 'function');
        assert.equal(typeof Module.ErrorMessage, 'function');
    });

    it('should export all Action classes', () => {
        assert.equal(typeof Module.Action, 'function');
        assert.equal(typeof Module.ResetAction, 'function');
        assert.equal(typeof Module.ReloadAction, 'function');
    });
});