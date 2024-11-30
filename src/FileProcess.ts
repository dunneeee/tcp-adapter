import { createWriteStream } from "fs";
import { Packet } from "./Packet";
import { FileChunk, FileInfo, FileWriteInfo } from "./types";
import { generateFilepath, isFileChunk, isFileInfo } from "./utils";
import { randomUUID } from "crypto";
import EventEmitter from "events";

interface EventMap {
  end: [FileInfo];
  error: [Error];
  data: [{ chunk: Buffer; length: number; info: FileInfo }];
}
export class FileProcess extends EventEmitter<EventMap> {
  private map = new Map<string, FileWriteInfo>();

  async process(packet: Packet<FileChunk>) {
    if (isFileChunk(packet.data)) {
      const { chunk, id } = packet.data;
      const info = this.map.get(id);
      if (!info || !chunk) return;
      const bufferChunk = Buffer.from(chunk);
      info.stream.write(bufferChunk);
      info.length += bufferChunk.length;

      this.emit("data", { chunk, length: info.length, info: info.info });

      if (info.length >= info.info.size) {
        this.emit("end", info.info);
        info.stream.end();
        clearTimeout(info.timeout);
        this.map.delete(id);
      }
    }
  }

  createStream(info: FileInfo) {
    const path = generateFilepath(info.path);
    const stream = createWriteStream(path);
    const id = randomUUID();
    const timeout = setTimeout(() => {
      stream.end();
      this.map.delete(id);
    }, 1000 * 60 * 5);
    this.map.set(id, { stream, info, length: 0, path, timeout });

    return id;
  }
}
