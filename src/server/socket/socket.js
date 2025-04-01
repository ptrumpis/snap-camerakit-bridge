import { WebSocketServer as Server } from 'ws';

class SocketServer {
    #port;
    #clientSocket;
    #webSocket;
    #wss;

    constructor(port = 3000) {
        this.#port = port;
        this.#clientSocket = null;
        this.#webSocket = null;
        this.#wss = null;
    }

    getPort() {
        return this.#port;
    }

    isBridgeUp() {
        return this.#wss && this.#webSocket && this.#webSocket.readyState === WebSocket.OPEN;
    }

    start() {
        if (this.#wss) {
            return Promise.resolve(false);
        }

        return new Promise((resolve, reject) => {
            try {
                this.#wss = new Server({ port: this.#port });
                this.#init();

                this.#wss.once('listening', () => {
                    resolve(true);
                });

                this.#wss.once('error', (err) => {
                    reject(err);
                });


            } catch (err) {
                reject(err);
            }
        });
    }

    close() {
        if (!this.#wss) {
            return Promise.resolve(false);
        }

        return new Promise((resolve, reject) => {
            try {
                if (this.#clientSocket) {
                    this.#clientSocket.close();
                    this.#clientSocket = null;
                }
                if (this.#webSocket) {
                    this.#webSocket.close();
                    this.#webSocket = null;
                }

                this.#wss.clients.forEach(client => client.close());

                this.#wss.close(() => {
                    resolve(true);
                });

                this.#wss = null;
            } catch (err) {
                reject(err);
            }
        });
    }

    #init() {
        this.#wss.on('connection', (ws, req) => {
            const protocol = req.headers['sec-websocket-protocol'];
            if (protocol?.startsWith('CameraKitClient')) {
                this.#clientSocket = ws;
            } else if (protocol?.startsWith('CameraKitWeb')) {
                this.#webSocket = ws;
            }

            ws.on('message', (message) => {
                if (ws === this.#clientSocket && this.#webSocket) {
                    this.#webSocket.send(message.toString());
                } else if (ws === this.#webSocket && this.#clientSocket) {
                    this.#clientSocket.send(message.toString());
                }
            });

            ws.on('close', () => {
                if (ws === this.#clientSocket) {
                    this.#clientSocket = null;
                } else if (ws === this.#webSocket) {
                    this.#webSocket = null;
                }
            });
        });
    }
}

export { SocketServer };
export default SocketServer;
