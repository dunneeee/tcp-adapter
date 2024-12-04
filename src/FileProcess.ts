import { createWriteStream } from "fs";
import { Packet } from "./Packet";
import { FileChunk, FileInfo, FileWriteInfo } from "./types";
import { generateFilepath, isFileChunk, isFileInfo } from "./utils";
import { randomUUID } from "crypto";
import EventEmitter from "events";
import { Queue } from "./Queue";

interface EventMap {
  end: [FileInfo, id: string];
  error: [Error, info: FileInfo, id: string];
  data: [{ chunk: Buffer; length: number; info: FileInfo; id: string }];
}
export class FileProcess extends EventEmitter<EventMap> {
  private map = new Map<string, FileWriteInfo>();
  private queue = new Queue<Packet<FileChunk>>(this.processQueue.bind(this));

  async process(packet: Packet<FileChunk>) {
    this.queue.add(packet);
  }

  private async processQueue(packet: Packet<FileChunk>) {
    if (isFileChunk(packet.data)) {
      console.log("Processing", packet);
      const { chunk, id } = packet.data;
      this.setTimeout(id);
      const info = this.map.get(id);
      if (!info || !chunk) return;
      const bufferChunk = Buffer.from(chunk);
      info.stream.write(bufferChunk);
      info.length += bufferChunk.length;

      this.emit("data", { chunk, length: info.length, info: info.info, id });

      if (info.length >= info.info.size) {
        this.emit("end", info.info, id);
        info.stream.end();
        if (info.timeout) clearTimeout(info.timeout);
        this.map.delete(id);
      }
    }
  }

  createStream(info: FileInfo): string;
  createStream(info: FileInfo, id: string): string;
  createStream(info: FileInfo, id?: string) {
    const path = generateFilepath(info.path);
    const stream = createWriteStream(path);
    const currentId = id || randomUUID();
    info.path = path;
    this.map.set(currentId, {
      stream,
      info,
      length: 0,
      path,
      timeout: null,
    });

    this.setTimeout(currentId);

    return currentId;
  }

  getStream(id: string) {
    const info = this.map.get(id);
    return info?.stream;
  }

  getWriterInfo(id: string) {
    return this.map.get(id)?.info;
  }

  cleanStream(id: string) {
    const info = this.map.get(id);
    if (!info) return;
    info.stream.end();
    if (info.timeout) clearTimeout(info.timeout);
    this.map.delete(id);
  }

  private setTimeout(id: string) {
    const info = this.map.get(id);
    if (!info) return;
    if (info.timeout) clearTimeout(info.timeout);
    info.timeout = setTimeout(() => {
      info.stream.end();
      this.map.delete(id);
      this.emit("error", new Error("TIMEOUT"), info.info, id);
    }, 1000 * 60 * 5);

    return info.timeout;
  }
}
