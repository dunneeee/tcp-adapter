"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = exports.PacketTypeDefault = void 0;
exports.isPacketSerializable = isPacketSerializable;
const PacketOutput_1 = require("./PacketOutput");
var PacketTypeDefault;
(function (PacketTypeDefault) {
    PacketTypeDefault[PacketTypeDefault["Error"] = 0] = "Error";
    PacketTypeDefault[PacketTypeDefault["Data"] = 1] = "Data";
})(PacketTypeDefault || (exports.PacketTypeDefault = PacketTypeDefault = {}));
function isPacketSerializable(obj) {
    return (typeof obj === "object" && obj !== null && "type" in obj && "data" in obj);
}
class Packet {
    constructor(dataOrId, typeOrData, id) {
        if (typeof dataOrId === "number") {
            this.id = dataOrId;
            this.data = typeOrData;
            this.type = PacketTypeDefault.Data;
        }
        else if (arguments.length === 1) {
            this.data = dataOrId;
            this.type = PacketTypeDefault.Data;
            this.id = -1;
        }
        else if (arguments.length === 2 && typeof typeOrData === "number") {
            this.data = dataOrId;
            this.type = typeOrData;
            this.id = -1;
        }
        else {
            this.data = dataOrId;
            this.type = typeOrData;
            this.id = id;
        }
    }
    toBuffer() {
        return Buffer.from(JSON.stringify({
            id: this.id,
            data: this.data,
        }));
    }
    toPlainObject() {
        return {
            type: this.type,
            data: this.data,
            id: this.id,
        };
    }
    newOutput(adapter) {
        return new PacketOutput_1.PacketOutput(this, adapter);
    }
}
exports.Packet = Packet;
//# sourceMappingURL=Packet.js.map