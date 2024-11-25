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
const net_1 = require("net");
const TcpAdapter_1 = require("./TcpAdapter");
const fs_1 = require("fs");
const TcpOutput_1 = require("./TcpOutput");
const Packet_1 = require("./Packet");
const socket = (0, net_1.createConnection)(3000);
socket.on("connect", () => __awaiter(void 0, void 0, void 0, function* () {
    const adapter = new TcpAdapter_1.TcpAdapter(socket);
    const out = new TcpOutput_1.TcpOutput(adapter);
    const buffer = [];
    const stream = (0, fs_1.createReadStream)("video.webm", {
        highWaterMark: 1024,
    });
    stream.on("data", (chunk) => {
        stream.pause();
        console.log(chunk);
        out
            .requestWithTimeout(new Packet_1.Packet(chunk), null)
            .then(() => {
            stream.resume();
        })
            .catch(console.error);
    });
}));
//# sourceMappingURL=peer2.test.js.map