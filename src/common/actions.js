import { Serializable } from "./serialize.js";

class Action extends Serializable() {
    #code = '';

    constructor(code) {
        if (new.target === Action) {
            throw new Error('Cannot instantiate an abstract class Action directly!');
        }

        super();
        this.#code = code;
    }

    getCode() {
        return this.#code;
    }

    static isAction(value) {
        return value instanceof Action;
    }
}

class ResetAction extends Action {
    constructor() {
        super('delete window.cameraKitWeb; window.cameraKitWeb = new CameraKitWeb();');
    }

    static fromJSON() {
        return new ResetAction();
    }
}

class ReloadAction extends Action {
    constructor() {
        super('window.location.href = window.location.href;');
    }

    static fromJSON() {
        return new ReloadAction();
    }
}

Action
    .register(Action)
    .register(ResetAction)
    .register(ReloadAction);

export { Action, ResetAction, ReloadAction };
export default { Action, ResetAction, ReloadAction };
