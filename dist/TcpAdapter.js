"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpAdapter = void 0;
const DataResolver_1 = require("./DataResolver");
const events_1 = __importDefault(require("events"));
const Packet_1 = require("./Packet");
const PacketProcess_1 = require("./PacketProcess");
const PacketTransformer_1 = require("./PacketTransformer");
class TcpAdapter extends events_1.default {
    constructor(socket, context = {}) {
        super();
        this.socket = socket;
        this.dataResolver = context.dataResolver || new DataResolver_1.DataResolver();
        this.packetTransformer =
            context.packetTransformer || new PacketTransformer_1.PacketTransformer();
        this.packetProcess = context.packetProcess || new PacketProcess_1.PacketProcess(this);
        this.init();
    }
    handleSocketError(error) {
        this.emit("error", error);
    }
    handleSocketDisconnect(hadError) {
        this.dataResolver.clearQuietly();
        this.emit("disconnect", hadError);
    }
    handleSocketData(data) {
        this.emit("data", data);
        let packets = [];
        try {
            packets = this.packetTransformer.decode(data);
        }
        catch (error) {
            this.emit("error", new TypeError("INVALID_PACKET"), new Packet_1.Packet(data));
        }
        this.packetProcess.process(packets);
    }
    canWrite() {
        return !this.socket.destroyed;
    }
    getSocket() {
        return this.socket;
    }
    getDataResolver() {
        return this.dataResolver;
    }
    getPacketTransformer() {
        return this.packetTransformer;
    }
    init() {
        this.socket.on("error", this.handleSocketError.bind(this));
        this.socket.on("close", this.handleSocketDisconnect.bind(this));
        this.socket.on("data", this.handleSocketData.bind(this));
    }
}
exports.TcpAdapter = TcpAdapter;
//# sourceMappingURL=TcpAdapter.js.map