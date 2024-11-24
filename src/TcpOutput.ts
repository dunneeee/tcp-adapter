import { Writable } from "stream";
import { Packet, PacketTypeDefault } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";
import { FileCallbackParams } from "./types";

export class TcpOutput {
  constructor(private adapter: TcpAdapter) {}

  send<T>(packet: Packet<T>, silent?: boolean): Promise<void>;
  send<T>(data: T, silent?: boolean): Promise<void>;
  async send<T>(packetOrData: Packet<T> | T, silent = false): Promise<void> {
    const packet =
      packetOrData instanceof Packet ? packetOrData : new Packet(packetOrData);

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
  }

  async request<R = any, T = any>(data: T, type: number): Promise<R>;
  async request<R = any, T = any>(packet: Packet<T>): Promise<R>;
  async request<R = any, T = any>(
    packetOrData: Packet<T> | T,
    type = PacketTypeDefault.Data
  ): Promise<R> {
    const packet =
      packetOrData instanceof Packet
        ? packetOrData
        : new Packet(packetOrData, type);

    return new Promise<R>((resolve, reject) => {
      const id = this.adapter.getDataResolver().register(resolve, reject);
      packet.id = id;
      this.send(packet, false).catch(reject);
    });
  }

  stream(
    id: string,
    onWriteCallback: (params: FileCallbackParams) => void
  ): Writable {
    const output = this;
    const stream = new Writable({
      write(chunk, _, callback) {
        const packet = new Packet(chunk, PacketTypeDefault.File, id);
        onWriteCallback({ chunk, length: chunk.length });
        output
          .send(packet, false)
          .then(() => callback())
          .catch(callback);
      },

      final(callback) {
        const packet = new Packet(null, PacketTypeDefault.File, id);
        output
          .send(packet, false)
          .then(() => callback())
          .catch(callback);
      },
    });

    return stream;
  }
}
