import { Action } from "./actions.js";
import { Serializable } from "./serialize.js";

class Message extends Serializable() {
    constructor() {
        if (new.target === Message) {
            throw new Error('Cannot instantiate an abstract class Message directly');
        }

        super();
    }

    static isMessage(value) {
        return value instanceof Message;
    }
}

class ActionMessage extends Message {
    constructor(action) {
        if (!Action.isAction(action)) {
            throw new Error(`Action "${className}" is not a valid Action class.`);
        }

        super();
        this.action = action;
    }

    static fromJSON(json) {
        const instance = super.fromJSON(json);
        instance.action = Action.fromJSON(instance.action);
        return instance;
    }
}

class CallMessage extends Message {
    constructor(method, params) {
        super();
        this.method = method;
        this.params = params;
    }
}

class DataMessage extends Message {
    constructor(data) {
        super();
        this.data = data;
    }
}

class ErrorMessage extends Message {
    constructor(error) {
        super();
        this.error = error;
    }
}

Message.register(Message);
ActionMessage.register(ActionMessage);
CallMessage.register(CallMessage);
DataMessage.register(DataMessage);
ErrorMessage.register(ErrorMessage);

export { Message, ActionMessage, CallMessage, DataMessage, ErrorMessage };
export default { Message, ActionMessage, CallMessage, DataMessage, ErrorMessage };
