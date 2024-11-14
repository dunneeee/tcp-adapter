"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketProcess = void 0;
const constants_1 = require("./constants");
const Packet_1 = require("./Packet");
class PacketProcess {
    constructor(adapter) {
        this.adapter = adapter;
    }
    process(packets) {
        packets.forEach((packet) => {
            this.adapter.emit("packet", packet);
            this.handle(packet);
        });
    }
    handle(packet) {
        if (packet.id === constants_1.NON_ID)
            return this.handleSpecialPacket(packet);
        return this.handleNormalPacket(packet);
    }
    handleSpecialPacket(packet) {
        if (packet.type === Packet_1.PacketTypeDefault.Error)
            return this.adapter.emit("packet_out_resolving", null, packet.data);
        return this.adapter.emit("packet_out_resolving", packet, null);
    }
    handleNormalPacket(packet) {
        if (packet.type === Packet_1.PacketTypeDefault.Error) {
            const err = packet.data;
            return this.adapter.getDataResolver().reject(packet.id, err);
        }
        this.adapter.emit("packet_in_resolving", packet);
        return this.adapter.getDataResolver().resolve(packet.id, packet.data);
    }
}
exports.PacketProcess = PacketProcess;
//# sourceMappingURL=PacketProcess.js.map