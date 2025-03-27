class Message {
    static registry = new Map();

    constructor(type) {
        if (this.constructor === Message) {
            throw new Error('Cannot instantiate an abstract class Message directly');
        }
        this.type = type;
    }

    toString() {
        return `[${this.constructor.name}]`;
    }

    toJSON() {
        return {
            ...this,
            className: this.constructor.name
        };
    }

    static fromJSON(json) {
        const { className, ...rest } = json;

        if (!className) {
            throw new Error(`Missing className in JSON.`);
        }

        const messageClass = Message.registry.get(className);
        if (!messageClass) {
            throw new Error(`Class "${className}" not found for deserialization.`);
        }

        if (!(messageClass.prototype instanceof Message)) {
            throw new Error(`Class "${className}" is not a valid Message class.`);
        }

        const instance = new messageClass(rest.message);
        Object.assign(instance, rest);
        return instance;
    }
}

class CallMessage extends Message {
    constructor(method, params) {
        super('call');
        this.method = method;
        this.params = params;
    }
}
registerMessageClass(CallMessage);

class DataMessage extends Message {
    constructor(data) {
        super('data');
        this.data = data;
    }
}
registerMessageClass(DataMessage);

class ErrorMessage extends Message {
    constructor(error) {
        super('error');
        this.error = error;
    }
}
registerMessageClass(ErrorMessage);

function registerMessageClass(cls) {
    Message.registry.set(cls.name, cls);
}

export { Message, CallMessage, DataMessage, ErrorMessage };
export default { Message, CallMessage, DataMessage, ErrorMessage };
