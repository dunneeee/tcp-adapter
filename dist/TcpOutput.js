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
    request(packetOrData, typeOrId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = typeof typeOrId === "string" ? typeOrId : id;
            const type = typeof typeOrId === "number" ? typeOrId : Packet_1.PacketTypeDefault.Data;
            const packet = packetOrData instanceof Packet_1.Packet
                ? packetOrData
                : new Packet_1.Packet(packetOrData, type);
            return new Promise((resolve, reject) => {
                const id = this.adapter.getDataResolver().register(resolve, reject, _id);
                packet.id = id;
                this.send(packet, false).catch(reject);
            });
        });
    }
    requestWithTimeout(packetOrData_1, typeOrTimeout_1) {
        return __awaiter(this, arguments, void 0, function* (packetOrData, typeOrTimeout, timeout = null) {
            const packet = packetOrData instanceof Packet_1.Packet
                ? packetOrData
                : new Packet_1.Packet(packetOrData, typeOrTimeout);
            return new Promise((resolve, reject) => {
                const id = this.adapter
                    .getDataResolver()
                    .registerWithTimeout(resolve, reject, timeout);
                packet.id = id;
                this.send(packet, false).catch(reject);
            });
        });
    }
    stream(id, stream) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                stream.on("data", (chunk) => {
                    stream.pause();
                    const packet = new Packet_1.Packet(chunk, Packet_1.PacketTypeDefault.File);
                    this.request(packet, id)
                        .then((res) => {
                        console.log(res);
                        stream.resume();
                    })
                        .catch((e) => {
                        reject(e);
                        stream.close();
                    });
                });
                stream.on("end", () => {
                    const packet = new Packet_1.Packet(null, Packet_1.PacketTypeDefault.File);
                    this.request(packet, id)
                        .then(() => {
                        resolve();
                    })
                        .catch(reject);
                });
            });
        });
    }
}
exports.TcpOutput = TcpOutput;
//# sourceMappingURL=TcpOutput.js.map