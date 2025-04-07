import assert from 'assert';
import { WebSocketServer } from 'ws';
import { CameraKitClient, DataMessage, SnapCameraFormatter } from '../src/index.js';

import rawLens from './data/lens.original.json' with { type: 'json' };
import rawLensWithMeta from './data/lens.original.with_meta.json' with { type: 'json' };
import rawLenses from './data/lenses.original.json' with { type: 'json' };
import rawLensesWithMeta from './data/lenses.original.with_meta.json' with { type: 'json' };
import rawMeta from './data/meta.original.json' with { type: 'json' };

import snapCameraLens from './data/lens.snapcamera.json' with { type: 'json' };
import snapCameraLensWithMeta from './data/lens.snapcamera.with_meta.json' with { type: 'json' };
import snapCameraLenses from './data/lenses.snapcamera.json' with { type: 'json' };
import snapCameraLensesWithMeta from './data/lenses.snapcamera.with_meta.json' with { type: 'json' };
import snapCameraMeta from './data/meta.snapcamera.json' with { type: 'json' };

describe('CameraKitClient', function () {
    let server;
    let client;

    beforeEach((done) => {
        server = new WebSocketServer({ port: 9999 });

        server.on('connection', (socket) => {
            socket.on('message', (message) => {
                const parsedMessage = JSON.parse(message);
                let responseMessage = null;

                if (parsedMessage.method === 'init') {
                    responseMessage = new DataMessage(true);
                }

                if (parsedMessage.method === 'loadLens') {
                    if (parsedMessage.params[2] === false) {
                        responseMessage = new DataMessage(rawLens);
                    } else {
                        responseMessage = new DataMessage(rawLensWithMeta);
                    }
                }

                if (parsedMessage.method === 'loadLensGroup') {
                    if (parsedMessage.params[1] === false) {
                        responseMessage = new DataMessage(rawLenses);
                    } else {
                        responseMessage = new DataMessage(rawLensesWithMeta);
                    }
                }

                if (parsedMessage.method === 'getLensMetadata') {
                    responseMessage = new DataMessage(rawMeta)
                }

                socket.send(JSON.stringify(responseMessage));
            });
        });
        done();
    });

    afterEach((done) => {
        server.close(() => done());
    });

    describe('Initialization', function () {
        it('should throw error for invalid formatter', () => {
            assert.throws(() => {
                new CameraKitClient(mockAddress, { formatter: 'invalidFormatter' });
            }, Error, 'Invalid formatter. You need to pass a sub class of LensFormatter.');
        });

        it('should accept SnapCameraFormatter as lens formatter', () => {
            assert.doesNotThrow(() => {
                new CameraKitClient('ws://localhost:9999', { formatter: SnapCameraFormatter });
            });
        });

        it('should initialize the client', async () => {
            const client = new CameraKitClient('ws://localhost:9999');
            const apiToken = 'test-token';

            const result = await client.init(apiToken);
            assert.strictEqual(result, true);
        });
    });

    describe('Call methods with default Formatter', function () {
        beforeEach((done) => {
            client = new CameraKitClient('ws://localhost:9999');
            done();
        });

        it('should load a lens without metadata', async () => {
            const lensId = '58517751140';
            const groupId = '5823ca90-5e1a-44b4-a007-644cab5c6e64';

            const result = await client.loadLens(lensId, groupId, false);
            assert.deepStrictEqual(result, rawLens);
        });

        it('should load a lens with metadata', async () => {
            const lensId = '58517751140';
            const groupId = '5823ca90-5e1a-44b4-a007-644cab5c6e64';

            const result = await client.loadLens(lensId, groupId);
            assert.deepStrictEqual(result, rawLensWithMeta);
        });

        it('should load a lens group without metadata', async () => {
            const groupId = '5823ca90-5e1a-44b4-a007-644cab5c6e64';

            const result = await client.loadLensGroup(groupId, false);
            assert.deepStrictEqual(result, rawLenses);
        });

        it('should load a lens group with metadata', async () => {
            const groupId = '5823ca90-5e1a-44b4-a007-644cab5c6e64';

            const result = await client.loadLensGroup(groupId);
            assert.deepStrictEqual(result, rawLensesWithMeta);
        });

        it('should get lens metadata', async () => {
            const lensId = '58517751140';

            const result = await client.getLensMetadata(lensId);
            assert.deepStrictEqual(result, rawMeta);
        });
    });

    describe('Call methods with Snap Camera Formatter', function () {
        beforeEach((done) => {
            client = new CameraKitClient('ws://localhost:9999', { formatter: SnapCameraFormatter });
            done();
        });

        it('should load a lens without metadata and format as Snap Camera', async () => {
            const lensId = '58517751140';
            const groupId = '5823ca90-5e1a-44b4-a007-644cab5c6e64';

            const result = await client.loadLens(lensId, groupId, false);
            assert.deepStrictEqual(result, snapCameraLens);
        });

        it('should load a lens with metadata and format as Snap Camera', async () => {
            const lensId = '58517751140';
            const groupId = '5823ca90-5e1a-44b4-a007-644cab5c6e64';

            const result = await client.loadLens(lensId, groupId);
            assert.deepStrictEqual(result, snapCameraLensWithMeta);
        });

        it('should load a lens group without metadata and format as Snap Camera', async () => {
            const groupId = '5823ca90-5e1a-44b4-a007-644cab5c6e64';

            const result = await client.loadLensGroup(groupId, false);
            assert.deepStrictEqual(result, snapCameraLenses);
        });

        it('should load a lens group with metadata and format as Snap Camera', async () => {
            const groupId = '5823ca90-5e1a-44b4-a007-644cab5c6e64';

            const result = await client.loadLensGroup(groupId);
            assert.deepStrictEqual(result, snapCameraLensesWithMeta);
        });

        it('should get lens metadata and format as Snap Camera', async () => {
            const lensId = '58517751140';

            const result = await client.getLensMetadata(lensId);
            assert.deepStrictEqual(result, snapCameraMeta);
        });
    });
});
