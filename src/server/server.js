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
            return Promise.resolve(false);
        }

        return new Promise(async (resolve, reject) => {
            try {
                this.#httpServer = new HttpServer({ rootDir: this.#rootDir, port: this.#httpPort });
                this.#socketServer = new SocketServer(this.#socketPort);

                const results = await Promise.allSettled([
                    this.#httpServer.start(),
                    this.#socketServer.start(),
                ]);

                const hasError = results.some(result => result.status === 'rejected');
                if (hasError) {
                    await this.close();

                    const errors = results.filter(r => r.status === 'rejected').map(r => r.reason);
                    throw new AggregateError(errors, `Failed to start server due to:\n${errors.map(error => error.message).join('\n')}`);
                }

                return resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    async close() {
        if (!this.#httpServer || !this.#socketServer) {
            return Promise.resolve(false);
        }

        return new Promise(async (resolve, reject) => {
            try {
                const results = await Promise.allSettled([
                    this.#httpServer.close(),
                    this.#socketServer.close()
                ]);

                this.#httpServer = null;
                this.#socketServer = null;

                const hasError = results.some(result => result.status === 'rejected');
                if (hasError) {
                    const errors = results.filter(r => r.status === 'rejected').map(r => r.reason);
                    throw new AggregateError(errors, `Failed to stop server due to:\n${errors.map(error => error.message).join('\n')}`);
                }

                return resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }
}

export { CameraKitServer };
export default CameraKitServer;
