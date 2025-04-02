import { Action } from '../common/actions.js';
import { BridgeError, MessageError, MethodNotFoundError } from '../common/errors.js';
import { Message, DataMessage, ErrorMessage, ActionMessage, CallMessage } from '../common/messages.js';
import CameraKitWeb from './web.js';

window.CameraKitWeb = CameraKitWeb;
window.cameraKitWeb = new CameraKitWeb();

const urlParams = new URLSearchParams(window?.location?.search || '');
const websocketPort = urlParams.get('websocketPort');

if (!websocketPort) {
    console.error(`You need to specify the 'websocketPort' URL param like this: ${window?.location || '/'}?websocketPort=3000`);
} else if (Number(websocketPort) !== parseInt(websocketPort) || websocketPort < 0 || websocketPort > 65535) {
    console.error(`You need to specify a valid port number between (0 - 65535)`);
} else {
    const socket = new WebSocket(`ws://localhost:${websocketPort}`, `CameraKitWeb-${__VERSION__}`);

    socket.onopen = () => console.log('CameraKitWeb connection established');
    socket.onerror = (error) => console.error('CameraKitWeb socket error:', error);

    const sendMessage = (message) => socket.send(JSON.stringify(message));

    socket.onmessage = async (event) => {
        try {
            let message = null;
            try {
                if (typeof event.data !== 'string') {
                    throw new Error(`Received invalid data type: ${typeof event.data}`);
                }
                message = Message.fromJSON(JSON.parse(event.data));
            } catch (e) {
                throw new MessageError(e.message, e.name);
            }

            if (message instanceof ActionMessage && Action.isAction(message.action)) {
                sendMessage(new DataMessage(true));

                eval(message.action.getCode());
            } else if (message instanceof CallMessage) {
                const { method, params } = message;
                if (typeof window.cameraKitWeb[method] !== 'function') {
                    throw new MethodNotFoundError(`Method '${method}' not found`);
                }

                const result = await window.cameraKitWeb[method](...params);
                sendMessage(new DataMessage(result));
            } else {
                throw new MessageError(`Message '${message.type}' is not supported.`);
            }
        } catch (error) {
            if (!(error instanceof BridgeError)) {
                error = new BridgeError(error.message, error.name);
            }

            sendMessage(new ErrorMessage(error));
        }
    };
}
