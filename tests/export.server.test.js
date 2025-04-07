import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import CameraKitServer from '../src/server/CameraKitServer.js';
import * as Module from '../src/server/CameraKitServer.js';

describe('Default Export: /server', () => {
    it('should export CameraKitServer', () => {
        assert.ok(typeof CameraKitServer === 'function');
    });
});

describe('Named Exports: /server', () => {
    it('should export CameraKitServer', () => {
        assert.equal(typeof Module.CameraKitServer, 'function');
    });
});