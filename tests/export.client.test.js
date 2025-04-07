import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import CameraKitClient from '../src/client/CameraKitClient.js';
import * as Module from '../src/client/CameraKitClient.js';

describe('Default Export: /client', () => {
    it('should export CameraKitClient', () => {
        assert.ok(typeof CameraKitClient === 'function');
    });
});

describe('Named Exports: /client', () => {
    it('should export CameraKitClient', () => {
        assert.equal(typeof Module.CameraKitClient, 'function');
    });
});