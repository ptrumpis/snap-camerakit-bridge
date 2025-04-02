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

CallMessage.register(CallMessage);
DataMessage.register(DataMessage);
ErrorMessage.register(ErrorMessage);

export { Message, CallMessage, DataMessage, ErrorMessage };
export default { Message, CallMessage, DataMessage, ErrorMessage };
