import assert from 'assert';
import { CameraKitServer } from '../src/server/CameraKitServer.js';

describe('CameraKitServer', function () {
    let server;

    beforeEach(() => {
        server = new CameraKitServer({ httpPort: 9999, socketPort: 9998 });
    });

    afterEach(async () => {
        await server.close();
    });

    it('should initialize with default ports', () => {
        assert.strictEqual(server.getHttpPort(), 9999);
        assert.strictEqual(server.getSocketPort(), 9998);
    });

    it('should start the server correctly', async () => {
        const result = await server.start();
        assert.strictEqual(result, true);
    });

    it('should fail to start the server if already started', async () => {
        await server.start();
        const result = await server.start();
        assert.strictEqual(result, false);
    });

    it('should close the server correctly', async () => {
        await server.start();
        const result = await server.close();
        assert.strictEqual(result, true);
    });

    it('should return false when trying to close a server that is not started', async () => {
        const result = await server.close();
        assert.strictEqual(result, false);
    });
});