"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketTransformer = void 0;
const Packet_1 = require("./Packet");
class PacketTransformer {
    decode(data) {
        const result = [];
        while (data.length > 0) {
            const packetLength = data.readUInt32BE(0);
            const packetEvent = data.readUInt32BE(PacketTransformer.LENGTH_HEADER_SIZE);
            const packetFeedBack = data.readUInt32BE(PacketTransformer.LENGTH_HEADER_SIZE +
                PacketTransformer.EVENT_HEADER_SIZE);
            const packetBody = data.subarray(PacketTransformer.HEADER_SIZE, packetLength);
            const jsonParsedBody = JSON.parse(packetBody.toString());
            const packet = new Packet_1.Packet(jsonParsedBody.data, packetEvent, jsonParsedBody.id).setFeedback(packetFeedBack === 1);
            result.push(packet);
            data = data.subarray(packetLength);
        }
        return result;
    }
    encode(data) {
        const lengthHeader = Buffer.alloc(PacketTransformer.LENGTH_HEADER_SIZE);
        const eventHeader = Buffer.alloc(PacketTransformer.EVENT_HEADER_SIZE);
        const feedBackHeader = Buffer.alloc(PacketTransformer.FEEDBACK_HEADER_SIZE);
        const isFeedback = data.isFeedback ? 1 : 0;
        const body = data.toBuffer();
        eventHeader.writeUInt32BE(typeof data.type === "number" ? data.type : Packet_1.PacketTypeDefault.Data, 0);
        lengthHeader.writeUInt32BE(lengthHeader.length +
            eventHeader.length +
            body.length +
            feedBackHeader.length, 0);
        feedBackHeader.writeUInt32BE(isFeedback, 0);
        return Buffer.concat([lengthHeader, eventHeader, feedBackHeader, body]);
    }
}
exports.PacketTransformer = PacketTransformer;
PacketTransformer.LENGTH_HEADER_SIZE = 4;
PacketTransformer.EVENT_HEADER_SIZE = 4;
PacketTransformer.FEEDBACK_HEADER_SIZE = 4;
PacketTransformer.HEADER_SIZE = PacketTransformer.LENGTH_HEADER_SIZE +
    PacketTransformer.EVENT_HEADER_SIZE +
    PacketTransformer.FEEDBACK_HEADER_SIZE;
//# sourceMappingURL=PacketTransformer.js.map