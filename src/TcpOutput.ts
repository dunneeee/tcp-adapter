import { ReadStream } from "fs";
import { Packet, PacketTypeDefault } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";

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
  async request<R = any, T = any>(
    data: T,
    type: number,
    id: string
  ): Promise<R>;
  async request<R = any, T = any>(data: T, id: string): Promise<R>;
  async request<R = any, T = any>(packet: Packet<T>, id: string): Promise<R>;
  async request<R = any, T = any>(packet: Packet<T>): Promise<R>;
  async request<R = any, T = any>(data: T): Promise<R>;
  async request<R = any, T = any>(
    packetOrData: Packet<T> | T,
    typeOrId?: number | string,
    id?: string
  ): Promise<R> {
    const _id = typeof typeOrId === "string" ? typeOrId : id;
    const type =
      typeof typeOrId === "number" ? typeOrId : PacketTypeDefault.Data;
    const packet =
      packetOrData instanceof Packet
        ? packetOrData
        : new Packet(packetOrData, type);

    return new Promise<R>((resolve, reject) => {
      const id = this.adapter.getDataResolver().register(resolve, reject, _id!);
      packet.id = id;
      this.send(packet, false).catch(reject);
    });
  }

  async requestWithTimeout<R = any, T = any>(
    data: T,
    type: number,
    timeout: number | null
  ): Promise<R>;
  async requestWithTimeout<R = any, T = any>(
    packet: Packet<T>,
    timeout: number | null
  ): Promise<R>;
  async requestWithTimeout<R = any, T = any>(
    packetOrData: Packet<T> | T,
    typeOrTimeout: number | null,
    timeout: number | null = null
  ): Promise<R> {
    const packet =
      packetOrData instanceof Packet
        ? packetOrData
        : new Packet(packetOrData, typeOrTimeout as number);

    return new Promise<R>((resolve, reject) => {
      const id = this.adapter
        .getDataResolver()
        .registerWithTimeout(resolve, reject, timeout);
      packet.id = id;
      this.send(packet, false).catch(reject);
    });
  }

  async stream(id: string, stream: ReadStream): Promise<void> {
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => {
        stream.pause();
        const packet = new Packet(chunk, PacketTypeDefault.File);
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
        const packet = new Packet(null, PacketTypeDefault.File);
        this.request(packet, id)
          .then(() => {
            resolve();
          })
          .catch(reject);
      });
    });
  }
}
