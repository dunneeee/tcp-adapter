"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpOutput = void 0;
const Packet_1 = require("./Packet");
class TcpOutput {
    constructor(adapter) {
        this.adapter = adapter;
    }
    send(packetOrData_1) {
        return __awaiter(this, arguments, void 0, function* (packetOrData, silent = false) {
            const packet = packetOrData instanceof Packet_1.Packet ? packetOrData : new Packet_1.Packet(packetOrData);
            return new Promise((resolve, reject) => {
                if (!this.adapter.canWrite()) {
                    return silent ? resolve() : reject(new Error("CANNOT_WRITE"));
                }
                const socket = this.adapter.getSocket();
                const data = this.adapter.getPacketTransformer().encode(packet);
                socket.write(data, (error) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve();
                });
            });
        });
    }
    request(packetOrData_1) {
        return __awaiter(this, arguments, void 0, function* (packetOrData, type = Packet_1.PacketTypeDefault.Data) {
            const packet = packetOrData instanceof Packet_1.Packet
                ? packetOrData
                : new Packet_1.Packet(packetOrData, type);
            return new Promise((resolve, reject) => {
                const id = this.adapter.getDataResolver().register(resolve, reject);
                packet.id = id;
                this.send(packet, false).catch(reject);
            });
        });
    }
}
exports.TcpOutput = TcpOutput;
//# sourceMappingURL=TcpOutput.js.map