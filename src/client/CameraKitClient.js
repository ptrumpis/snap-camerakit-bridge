import WebSocket from 'ws';
import { BridgeError, ProtocolError } from '../common/errors.js';
import { Message, CallMessage, ErrorMessage, DataMessage } from '../common/messages.js';
import LensFormatter from '../format/LensFormatter.js';
import OriginalFormatter from '../format/OriginalFormatter.js';
import pkg from '../../package.json' with { type: 'json' };

class CameraKitClient {
    #address;
    #timeout;
    #formatter;

    constructor(address, { timeout = 6000, formatter = OriginalFormatter } = {}) {
        this.#address = address;
        this.#timeout = parseInt(timeout) || 6000;

        if (!(formatter?.prototype instanceof LensFormatter)) {
            throw new Error('Invalid formatter. You need to pass a sub class of LensFormatter.');
        }

        this.#formatter = formatter;
    }

    async init(apiToken) {
        const message = new CallMessage('init', [apiToken]);
        return this.#sendMessage(message);
    }

    async loadLens(lensId, groupId, withMeta = true) {
        const message = new CallMessage('loadLens', [lensId, groupId, withMeta]);
        const lens = await this.#sendMessage(message);
        return lens ? this.#formatter.format(lens) : lens;
    }

    async loadLensGroup(groupId, withMeta = true) {
        const message = new CallMessage('loadLensGroup', [groupId, withMeta]);
        const lenses = await this.#sendMessage(message)
        return (Array.isArray(lenses) && lenses.length) ? lenses.map(this.#formatter.format) : lenses;
    }

    async getLensMetadata(lensId) {
        const message = new CallMessage('getLensMetadata', [lensId]);
        const meta = await this.#sendMessage(message);
        return (typeof meta === 'object' && Object.keys(meta).length) ? this.#formatter.format(meta) : meta;
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
                        if (message instanceof DataMessage) {
                            resolve(message.data);
                        } else if (message instanceof ErrorMessage) {
                            reject(message.error);
                        } else {
                            reject(new ProtocolError(`Received invalid response message: ${message}`));
                        }
                    } catch (e) {
                        reject(new ProtocolError(`Failed to parse message: ${e.message}`, e.name));
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
