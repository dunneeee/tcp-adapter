import {
  BUFFER_SIZE,
  CHUNK_SIZE,
  PAUSE_THRESHOLD,
  RESUME_THRESHOLD,
} from "./constants";
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

  stream(id: string, filePath: string, type: number = PacketTypeDefault.File) {
    let buffer = Buffer.alloc(0);
    let length = 0;

    const stream = createReadStream(filePath, {
      highWaterMark: CHUNK_SIZE,
    });

    const pausePoint = BUFFER_SIZE * PAUSE_THRESHOLD;
    const resumePoint = BUFFER_SIZE * RESUME_THRESHOLD;

    stream.on("data", (chunk: Buffer) => {
      if (buffer.length >= pausePoint) {
        stream.pause();
      }
      buffer = Buffer.concat([buffer, chunk]);
    });

    const loop = new PauseableLoop(async () => {
      if (
        (stream.destroyed && buffer.length === 0) ||
        this.adapter.getSocket().destroyed
      ) {
        loop.cancel();
        return;
      }

      if (buffer.length === 0) {
        stream.resume();
        return;
      }

      const chunk = buffer.subarray(0, CHUNK_SIZE);
      buffer = buffer.subarray(CHUNK_SIZE);
      length += chunk.length;

      if (buffer.length <= resumePoint) {
        stream.resume();
      }

      await this.send(new Packet({ id, chunk }, type));
    });

    return {
      loop,
      getLength: () => length,
    };
  }
}
