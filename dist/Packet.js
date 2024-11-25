"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = exports.PacketTypeDefault = void 0;
exports.isPacketSerializable = isPacketSerializable;
const constants_1 = require("./constants");
const PacketOutput_1 = require("./PacketOutput");
const utils_1 = require("./utils");
var PacketTypeDefault;
(function (PacketTypeDefault) {
    PacketTypeDefault[PacketTypeDefault["Error"] = 0] = "Error";
    PacketTypeDefault[PacketTypeDefault["Data"] = 1] = "Data";
    PacketTypeDefault[PacketTypeDefault["File"] = 416] = "File";
})(PacketTypeDefault || (exports.PacketTypeDefault = PacketTypeDefault = {}));
function isPacketSerializable(obj) {
    return (typeof obj === "object" && obj !== null && "type" in obj && "data" in obj);
}
class Packet {
    constructor(dataOrId, typeOrData, id) {
        this.isFeedback = false;
        if (arguments.length === 1) {
            this.data = dataOrId;
            this.type = PacketTypeDefault.Data;
            this.id = constants_1.NON_ID;
        }
        else if (arguments.length === 2) {
            if ((0, utils_1.isUUID)(String(dataOrId))) {
                this.data = typeOrData;
                this.type = PacketTypeDefault.Data;
                this.id = dataOrId;
            }
            else {
                this.data = dataOrId;
                this.type = typeOrData;
                this.id = constants_1.NON_ID;
            }
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
    markAsFeedBack() {
        this.isFeedback = true;
        return this;
    }
    unMarkAsFeedBack() {
        this.isFeedback = false;
        return this;
    }
    setFeedback(value) {
        this.isFeedback = value;
        return this;
    }
}
exports.Packet = Packet;
//# sourceMappingURL=Packet.js.map