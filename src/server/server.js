import HttpServer from "./http/http.js";
import SocketServer from "./socket/socket.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

class CameraKitServer {
    #httpServer;
    #socketServer;
    #httpPort;
    #socketPort;
    #rootDir;

    constructor({ rootDir = dirname(fileURLToPath(import.meta.url)), httpPort = 8080, socketPort = 3000 } = {}) {
        this.#rootDir = rootDir;
        this.#httpPort = httpPort;
        this.#socketPort = socketPort;

        this.#httpServer = null;
        this.#socketServer = null;
    }

    getHttpPort() {
        return this.#httpPort;
    }

    getSocketPort() {
        return this.#socketPort;
    }

    async start() {
        if (this.#httpServer || this.#socketServer) {
            throw new Error('Server is already up and running!');
        }

        this.#httpServer = new HttpServer({ rootDir: this.#rootDir, port: this.#httpPort });
        this.#socketServer = new SocketServer(this.#socketPort);

        const results = await Promise.allSettled([
            this.#httpServer.start(),
            this.#socketServer.start(),
        ]);

        const hasError = results.some(result => result.status === 'rejected');
        if (hasError) {
            await this.close();
        }

        return !hasError;
    }

    async close() {
        if (!this.#httpServer || !this.#socketServer) {
            return false;
        }

        const results = await Promise.allSettled([
            this.#httpServer.close(),
            this.#socketServer.close()
        ]);

        this.#httpServer = null;
        this.#socketServer = null;

        const hasError = results.some(result => result.status === 'rejected');

        return !hasError;
    }
}

export { CameraKitServer };
export default CameraKitServer;
