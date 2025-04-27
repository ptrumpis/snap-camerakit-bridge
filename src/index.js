import CameraKitBridge from './bridge/CameraKitBridge.js';
import CameraKitClient from './client/CameraKitClient.js';
import CameraKitServer from './server/CameraKitServer.js';

import * as Formatters from './format/index.js';
import * as Actions from './common/actions.js';
import * as Errors from './common/errors.js';
import * as Messages from './common/messages.js';

export * from './bridge/CameraKitBridge.js';
export * from './client/CameraKitClient.js';
export * from './server/CameraKitServer.js';

export * from './format/index.js';
export * from './common/actions.js';
export * from './common/errors.js';
export * from './common/messages.js';

const stripDefault = ({ default: _default, ...rest }) => rest;

export default { 
    CameraKitBridge,
    CameraKitClient,
    CameraKitServer,
    ...stripDefault(Formatters),
    ...stripDefault(Actions),
    ...stripDefault(Errors),
    ...stripDefault(Messages),
};
