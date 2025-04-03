import assert from 'assert';
import sinon from 'sinon';
import { chromium } from 'playwright';
import CameraKitBridge from '../src/bridge/CameraKitBridge.js';

describe('CameraKitBridge', function () {
    let browserStub, pageStub, logHandlerStub, cameraKitBridge;

    beforeEach(function () {
        browserStub = {
            newPage: sinon.stub(),
            close: sinon.stub().resolves(),
        };
        pageStub = {
            goto: sinon.stub().resolves(),
            close: sinon.stub().resolves(),
            on: sinon.stub(),
        };
        logHandlerStub = sinon.stub();

        sinon.stub(chromium, 'launch').resolves(browserStub);
        browserStub.newPage.resolves(pageStub);

        cameraKitBridge = new CameraKitBridge({ logHandler: logHandlerStub });
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should start the browser and navigate to the target URL', async function () {
        const result = await cameraKitBridge.start();

        assert.strictEqual(chromium.launch.calledOnce, true);
        assert.strictEqual(browserStub.newPage.calledOnce, true);
        assert.strictEqual(pageStub.goto.calledOnceWith('https://localhost:8080/?websocketPort=3000', { waitUntil: 'domcontentloaded' }), true);
        assert.strictEqual(result, true);
    });

    it('should return false if start is called while browser is already running', async function () {
        await cameraKitBridge.start();
        const result = await cameraKitBridge.start();

        assert.strictEqual(result, false);
    });

    it('should close the browser and reset state', async function () {
        await cameraKitBridge.start();
        const result = await cameraKitBridge.close();

        assert.strictEqual(pageStub.close.calledOnce, true);
        assert.strictEqual(browserStub.close.calledOnce, true);
        assert.strictEqual(result, true);
    });

    it('should return false if close is called when browser is not running', async function () {
        const result = await cameraKitBridge.close();

        assert.strictEqual(result, false);
    });

    it('should log messages received from the page console', async function () {
        await cameraKitBridge.start();

        const consoleCallback = pageStub.on.getCall(0).args[1];
        consoleCallback({ text: () => 'Test log message' });

        assert.strictEqual(logHandlerStub.calledOnceWith('Test log message'), true);
    });

    it('should reject if an error occurs in start', async function () {
        chromium.launch.rejects(new Error('Launch failed'));

        await assert.rejects(() => cameraKitBridge.start(), {
            message: 'Launch failed',
        });
    });

    it('should reject if an error occurs in close', async function () {
        await cameraKitBridge.start();
        pageStub.close.rejects(new Error('Close failed'));

        await assert.rejects(() => cameraKitBridge.close(), {
            message: 'Close failed',
        });
    });
});
