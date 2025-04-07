import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import { LensFormatter, OriginalFormatter, SnapCameraFormatter } from '../src/index.js';

import rawLens from './data/lens.original.json' with { type: 'json' };
import rawLensWithMeta from './data/lens.original.with_meta.json' with { type: 'json' };
import rawMeta from './data/meta.original.json' with { type: 'json' };

import snapCameraLens from './data/lens.snapcamera.json' with { type: 'json' };
import snapCameraLensWithMeta from './data/lens.snapcamera.with_meta.json' with { type: 'json' };
import snapCameraMeta from './data/meta.snapcamera.json' with { type: 'json' };

describe('LensFormatter', () => {
    it('should throw when instantiated directly', () => {
        assert.throws(() => {
            new LensFormatter();
        }, /Cannot instantiate an abstract class LensFormatter directly!/);
    });

    it('should throw when calling format()', () => {
        assert.throws(() => {
            LensFormatter.format({});
        }, /Cannot call abstract method format\(\) directly!/);
    });

    it('should throw when calling reverse()', () => {
        assert.throws(() => {
            LensFormatter.reverse({});
        }, /Cannot call abstract method reverse\(\) directly!/);
    });

    it('should return snapcode URL for valid UUID', () => {
        const uuid = '0123456789abcdef0123456789abcdef';
        const expected = `https://app.snapchat.com/web/deeplink/snapcode?data=${uuid}&version=1&type=png`;
        assert.equal(LensFormatter.snapcodeUrl(uuid), expected);
    });

    it('should return empty string for invalid snapcode UUID', () => {
        assert.equal(LensFormatter.snapcodeUrl('invalid-uuid'), '');
    });

    it('should return deeplink URL for valid UUID', () => {
        const uuid = 'abcdefabcdefabcdefabcdefabcdefab';
        const expected = `https://snapchat.com/unlock/?type=SNAPCODE&uuid=${uuid}&metadata=01`;
        assert.equal(LensFormatter.deeplinkUrl(uuid), expected);
    });

    it('should return empty string for invalid deeplink UUID', () => {
        assert.equal(LensFormatter.deeplinkUrl('123'), '');
    });

    it('should extract UUID from valid deeplink', () => {
        const uuid = 'abcdefabcdefabcdefabcdefabcdefab';
        const url = `https://snapchat.com/unlock/?type=SNAPCODE&uuid=${uuid}&metadata=01`;
        assert.equal(LensFormatter.extractUuidFromDeeplink(url), uuid);
    });

    it('should extract UUID from www deeplink', () => {
        const uuid = 'abcdefabcdefabcdefabcdefabcdefab';
        const url = `https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=${uuid}&metadata=01`;
        assert.equal(LensFormatter.extractUuidFromDeeplink(url), uuid);
    });

    it('should return empty string for deeplink without UUID', () => {
        const url = `https://snapchat.com/unlock/?type=SNAPCODE&metadata=01`;
        assert.equal(LensFormatter.extractUuidFromDeeplink(url), '');
    });

    it('should return empty string for malformed deeplink', () => {
        assert.equal(LensFormatter.extractUuidFromDeeplink('not a url'), '');
    });
});

describe('SnapCameraFormatter', () => {
    it('should extend LensFormatter', () => {
        assert.ok(SnapCameraFormatter.prototype instanceof LensFormatter);
    });

    describe('format()', () => {
        it('should return an empty object if no lens is provided', () => {
            const result = SnapCameraFormatter.format();
            assert.deepEqual(result, {});
        });

        it('should return a Snap Camera lens with simple properties', () => {
            const result = SnapCameraFormatter.format(rawLens);
            assert.deepStrictEqual(result, snapCameraLens);
        });

        it('should return a Snap Camera lens with extended unlocking properties', () => {
            const result = SnapCameraFormatter.format(rawLensWithMeta);
            assert.deepStrictEqual(result, snapCameraLensWithMeta);
        });

        it('should return a Snap Camera lens with extended unlocking properties from metadata', () => {
            const result = SnapCameraFormatter.format(rawMeta);
            assert.deepStrictEqual(result, snapCameraMeta);
        });
    });

    describe('reverse()', () => {
        it('should return an empty object if no lens is provided', () => {
            const result = SnapCameraFormatter.reverse();
            assert.deepEqual(result, {});
        });

        it('should return a base lens', () => {
            const result = SnapCameraFormatter.reverse(snapCameraLens);
            assert.deepStrictEqual(result, rawLens);
        });

        it('should return a lens with metadata', () => {
            const result = SnapCameraFormatter.reverse(snapCameraLensWithMeta);
            assert.deepStrictEqual(result, rawLensWithMeta);
        });

        it('should return metadata from lens', () => {
            const result = SnapCameraFormatter.reverse(snapCameraMeta);

            const actualSubset = Object.fromEntries(
                Object.entries(result).filter(([key]) => key in rawMeta)
            );

            assert.deepEqual(actualSubset, rawMeta);
        });
    });
});

describe('OriginalFormatter', () => {
    it('should extend LensFormatter', () => {
        assert.ok(OriginalFormatter.prototype instanceof LensFormatter);
    });

    it('should return input unchanged from format()', () => {
        const lens = { id: 1, name: 'test' };
        const result = OriginalFormatter.format(lens);
        assert.equal(result, lens);
    });

    it('should return input unchanged from reverse()', () => {
        const lens = { id: 2, name: 'reverse' };
        const result = OriginalFormatter.reverse(lens);
        assert.equal(result, lens);
    });
});