
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CameraKitBridge, CameraKitServer } from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    const httpPort = 8080;
    const socketPort = 3000;

    const targetUrl = `https://localhost:${httpPort}/?websocketPort=${socketPort}`;

    const server = new CameraKitServer({ httpPort, socketPort, rootDir: join(__dirname, '../dist') })
    await server.start();

    const bridge = new CameraKitBridge({ targetUrl });
    await bridge.start();

    console.log('Camera-Kit Bridge is up and waiting for client connections!');
} catch (e) {
    console.error(e.message);
}
