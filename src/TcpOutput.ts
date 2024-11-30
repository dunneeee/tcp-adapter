import { Packet, PacketTypeDefault } from "./Packet";
import { PauseableLoop } from "./PauseableLoop";
import { TcpAdapter } from "./TcpAdapter";
import { createReadStream, ReadStream } from "fs";

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

  stream(id: string, path: string, chunkSize = 1024 * 32) {
    const pausePoint = chunkSize * 160;
    const stream = createReadStream(path, { highWaterMark: chunkSize });
    let buffer: Buffer = Buffer.from([]);
    let length = 0;
    stream.on("data", (chunk) => {
      if (buffer.length >= pausePoint) {
        stream.pause();
      }
      buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
    });

    const loop = new PauseableLoop(async () => {
      if (
        (stream.destroyed && buffer.length === 0) ||
        this.adapter.getSocket().destroyed
      ) {
        console.log("DESTROYED");
        loop.cancel();
        return;
      }
      if (buffer.length === 0) {
        stream.resume();
        return;
      }

      const chunk = buffer.subarray(0, chunkSize);
      buffer = buffer.subarray(chunkSize);

      length += chunk.length;

      if (buffer.length <= pausePoint) {
        stream.resume();
      }

      this.send(new Packet({ id, chunk }, PacketTypeDefault.File));
    }, 1000);

    return {
      stream,
      loop,
      getLength: () => length,
    };
  }
}
