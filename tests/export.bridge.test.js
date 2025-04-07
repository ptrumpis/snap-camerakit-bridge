import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import CameraKitBridge from '../src/bridge/CameraKitBridge.js';
import * as Module from '../src/bridge/CameraKitBridge.js';

describe('Default Export: /bridge', () => {
    it('should export CameraKitBridge', () => {
        assert.ok(typeof CameraKitBridge === 'function');
    });
});

describe('Named Exports: /bridge', () => {
    it('should export CameraKitBridge', () => {
        assert.equal(typeof Module.CameraKitBridge, 'function');
    });
});