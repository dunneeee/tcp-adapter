import { NON_ID } from "./constants";
import { Packet, PacketTypeDefault } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";

export class PacketProcess {
  constructor(private adapter: TcpAdapter) {}

  process(packets: Packet[]) {
    packets.forEach((packet) => {
      this.adapter.emit("packet", packet);
      this.handle(packet);
    });
  }

  protected handle(packet: Packet) {
    if (packet.id === NON_ID) return this.handleSpecialPacket(packet);
    return this.handleNormalPacket(packet);
  }

  protected handleSpecialPacket(packet: Packet) {
    if (packet.type === PacketTypeDefault.Error)
      return this.adapter.emit("packet_out_resolving", null, packet.data);
    return this.adapter.emit("packet_out_resolving", packet, null);
  }
  protected handleNormalPacket(packet: Packet) {
    if (packet.type === PacketTypeDefault.Error) {
      const err = packet.data;
      return this.adapter.getDataResolver().reject(packet.id, err);
    }

    this.adapter.emit("packet_in_resolving", packet);
    return this.adapter.getDataResolver().resolve(packet.id, packet.data);
  }
}
