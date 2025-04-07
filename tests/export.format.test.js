import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import DefaultExport from '../src/format/index.js';
import * as Module from '../src/format/index.js';

describe('Default Export: /format', () => {
    it('should be an object', () => {
        assert.ok(typeof DefaultExport === 'object');
    });

    it('should export all Formatter classes', () => {
        assert.ok(typeof DefaultExport.LensFormatter === 'function');
        assert.ok(typeof DefaultExport.OriginalFormatter === 'function');
        assert.ok(typeof DefaultExport.SnapCameraFormatter === 'function');
    });
});

describe('Named Exports: /format', () => {
    it('should export all Formatter classes', () => {
        assert.equal(typeof Module.LensFormatter, 'function');
        assert.equal(typeof Module.OriginalFormatter, 'function');
        assert.equal(typeof Module.SnapCameraFormatter, 'function');
    });
});