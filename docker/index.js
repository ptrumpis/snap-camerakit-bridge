
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CameraKitBridge, CameraKitServer } from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    const server = new CameraKitServer({ httpPort: 8080, socketPort: 3000, rootDir: join(__dirname, '../dist') })
    await server.start();

    const bridge = new CameraKitBridge({ targetUrl: 'https://localhost:8080/?websocketPort=3000' });
    await bridge.start();
} catch (e) {
    console.error(e.message);
}
