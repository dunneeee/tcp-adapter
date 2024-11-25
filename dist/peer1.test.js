"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const TcpAdapter_1 = require("./TcpAdapter");
const server = (0, net_1.createServer)((socket) => {
    const adapter = new TcpAdapter_1.TcpAdapter(socket);
    adapter.on("packet_in_resolving", (packet) => {
        console.log("packet_in_resolving", packet);
        packet.newOutput(adapter).response("ACK");
    });
    adapter.on("packet_out_resolving", (packet) => {
        console.log("packet_out_resolving", packet);
    });
});
server.listen(3000);
//# sourceMappingURL=peer1.test.js.map