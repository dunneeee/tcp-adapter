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
exports.PacketOutput = void 0;
const Packet_1 = require("./Packet");
const TcpOutput_1 = require("./TcpOutput");
class PacketOutput extends TcpOutput_1.TcpOutput {
    constructor(packet, adapter) {
        super(adapter);
        this.packet = packet;
    }
    response(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, silent = false, type = this.packet.type) {
            const packet = new Packet_1.Packet(data, type, this.packet.id);
            return this.send(packet, silent).then(() => packet);
        });
    }
    responseError(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, silent = false) {
            return this.response(data, silent, Packet_1.PacketTypeDefault.Error);
        });
    }
}
exports.PacketOutput = PacketOutput;
//# sourceMappingURL=PacketOutput.js.map