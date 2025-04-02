const Serializable = (Class) => class extends (Class || Object) {
    static registry = new Map();

    static register(cls) {
        if (!this.registry.has(cls.name)) {
            this.registry.set(cls.name, cls);
        }
    }

    toJSON() {
        const serialized = { ...this };
        serialized._className = this.constructor.name;

        for (let key in serialized) {
            if (serialized[key] && typeof serialized[key].toJSON === "function") {
                serialized[key] = serialized[key].toJSON();
            }
        }

        return serialized;
    }

    static fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }

        const { _className, ...rest } = json;

        if (!_className) {
            throw new Error(`Missing _className in JSON.`);
        }

        const _class = this.registry.get(_className);
        if (!_class) {
            throw new Error(`Class "${_className}" not found for deserialization.`);
        }

        if (!(_class instanceof this.constructor)) {
            throw new Error(`Class "${_className}" is not a valid class of type ${this.constructor.name}.`);
        }

        if (typeof _class.fromJSON === "function" && _class !== this) {
            return _class.fromJSON(json);
        }

        const instance = Object.create(_class.prototype);
        Object.assign(instance, rest);

        return instance;
    }
};

export { Serializable };
export default { Serializable };