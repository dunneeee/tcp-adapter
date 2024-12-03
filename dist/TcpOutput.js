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
const constants_1 = require("./constants");
const Packet_1 = require("./Packet");
const PauseableLoop_1 = require("./PauseableLoop");
const fs_1 = require("fs");
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
    stream(id, filePath, type = Packet_1.PacketTypeDefault.File) {
        let buffer = Buffer.alloc(0);
        let length = 0;
        const stream = (0, fs_1.createReadStream)(filePath, {
            highWaterMark: constants_1.CHUNK_SIZE,
        });
        const pausePoint = constants_1.BUFFER_SIZE * constants_1.PAUSE_THRESHOLD;
        const resumePoint = constants_1.BUFFER_SIZE * constants_1.RESUME_THRESHOLD;
        stream.on("data", (chunk) => {
            if (buffer.length >= pausePoint) {
                stream.pause();
            }
            buffer = Buffer.concat([buffer, chunk]);
        });
        const loop = new PauseableLoop_1.PauseableLoop(() => __awaiter(this, void 0, void 0, function* () {
            if ((stream.destroyed && buffer.length === 0) ||
                this.adapter.getSocket().destroyed) {
                loop.cancel();
                return;
            }
            if (buffer.length === 0) {
                stream.resume();
                return;
            }
            const chunk = buffer.subarray(0, constants_1.CHUNK_SIZE);
            buffer = buffer.subarray(constants_1.CHUNK_SIZE);
            length += chunk.length;
            if (buffer.length <= resumePoint) {
                stream.resume();
            }
            yield this.send(new Packet_1.Packet({ id, chunk }, type));
        }));
        return {
            loop,
            getLength: () => length,
        };
    }
}
exports.TcpOutput = TcpOutput;
//# sourceMappingURL=TcpOutput.js.map