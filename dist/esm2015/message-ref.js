export class MessageRef {
    constructor(namespace, key, values, formats) {
        this.namespace = namespace;
        this.key = key;
        this.values = values;
        this.formats = formats;
    }
    toJSON() {
        return [this.namespace, this.key, this.values];
    }
    toString() {
        return this.key;
    }
    fromJSON(json) {
        if (typeof json == "string") {
            let namespaceKey = json.trim().split("#");
            if (namespaceKey.length >= 2) {
                this["namespace"] = namespaceKey[0];
                this["key"] = namespaceKey[1];
                return;
            }
            else {
                this["namespace"] = undefined;
                this["key"] = json;
                return;
            }
        }
        else if (Array.isArray(json) && json.length > 0) {
            let namespace = json.length > 1 ? json[0] : undefined;
            let key = (json.length == 1 && json[0]) || (json.length > 1 && json[1]);
            let values = json.length == 3 && json[2];
            let formats = json.length == 4 && json[3];
            if ((namespace === null || namespace === undefined || typeof namespace == "string") && typeof key == "string") {
                this["namespace"] = namespace;
                this["key"] = key;
                this["values"] = values;
                this["formats"] = formats;
                return;
            }
        }
        throw new Error(`Cannot unserialize "${json}" as @co.mmons/js-intl/MessageRef`);
    }
}
//# sourceMappingURL=message-ref.js.map