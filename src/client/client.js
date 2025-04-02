import WebSocket from 'ws';
import { BridgeError, MessageError } from '../common/errors.js';
import { Message, CallMessage } from '../common/messages.js';
import pkg from '../../package.json' with { type: 'json' };

class CameraKitClient {
    #address;
    #timeout;

    constructor(address, options = {}) {
        this.#address = address;
        this.#timeout = options.timeout || 6000;
    }

    async init(apiToken) {
        const message = new CallMessage('init', [apiToken]);
        return this.#sendMessage(message);
    }

    async loadLensGroup(groupId, withMeta = true) {
        const message = new CallMessage('loadLensGroup', [groupId, withMeta]);
        return this.#sendMessage(message);
    }

    async getLensMetadata(lensId) {
        const message = new CallMessage('getLensMetadata', [lensId]);
        return this.#sendMessage(message);
    }

    async #sendMessage(message) {
        const socket = new WebSocket(this.#address, `CameraKitClient-${pkg.version}`);

        const timeoutId = setTimeout(() => {
            socket.terminate();
        }, this.#timeout);

        return new Promise((resolve, reject) => {
            socket.on('open', () => {
                clearTimeout(timeoutId);

                socket.on('message', (data) => {
                    let message = null;
                    try {
                        let dataString = data instanceof Buffer ? data.toString() : data;
                        if (typeof dataString !== 'string') {
                            throw new Error(`Received invalid data type: ${typeof dataString}`);
                        }
                        message = Message.fromJSON(JSON.parse(dataString));
                        resolve(message);
                    } catch (e) {
                        reject(new MessageError(e.message, e.name));
                    } finally {
                        socket.close();
                    }
                });

                socket.send(JSON.stringify(message));
            });

            socket.on('close', (code) => {
                reject(new BridgeError(`Connection closed. Code: ${code}`));
            });

            socket.on('error', (err) => {
                if (err instanceof AggregateError) {
                    reject(new BridgeError(err.errors.map(err => err.message).join('\n'), err.name));
                } else {
                    reject(new BridgeError(err.message, err.name));
                }
            });
        }).finally(() => {
            clearTimeout(timeoutId);

            return new Promise((resolve) => {
                if (socket.readyState === WebSocket.CLOSED) {
                    resolve();
                } else {
                    socket.on('close', resolve);
                    socket.close();
                }
            });
        });
    }
}

export { CameraKitClient };
export default CameraKitClient;
