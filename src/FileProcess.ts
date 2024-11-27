import { createWriteStream, WriteStream } from "fs";
import { Packet } from "./Packet";
import { FileInfo } from "./types";
import { generateFilepath, isFileInfo } from "./utils";
import { TcpAdapter } from "./TcpAdapter";
import path from "path";
import { ACK } from "./constants";

interface FileMapValue {
  info: FileInfo;
  writeStream: WriteStream;
  timeout?: NodeJS.Timeout;
}

export interface FileProcessConfig {
  rootFolder: string;
  timeout?: number;
}

export class FileProcess {
  private map = new Map<string, FileMapValue>();

  constructor(public config: FileProcessConfig) {}

  async process(packet: Packet, adapter: TcpAdapter) {
    const id = packet.id;

    if (!this.map.has(id)) {
      if (!isFileInfo(packet.data)) throw new Error("INVALID_DATA");
      const filePath = generateFilepath(
        path.resolve(this.config.rootFolder, packet.data.name)
      );
      const writeStream = createWriteStream(filePath);

      this.map.set(id, {
        info: packet.data,
        writeStream,
      });

      this.createTimeout(id);
      return packet.newOutput(adapter).response(id);
    }

    const handler = this.map.get(id);

    if (!handler) throw new Error("NOT_FOUND");
    this.clearTimeout(id);
    if (!packet.data) {
      handler.writeStream.end();
      this.map.delete(id);
      return packet.newOutput(adapter).response(ACK);
    }

    handler.writeStream.write(Buffer.from(packet.data));
    this.createTimeout(id);
    return packet.newOutput(adapter).response(ACK);
  }

  private createTimeout(id: string) {
    const handler = this.map.get(id);
    if (!handler || !this.config.timeout) return;
    if (handler.timeout) {
      clearTimeout(handler.timeout);
    }
    handler.timeout = setTimeout(() => {
      this.map.delete(id);
      handler.writeStream.close();
    }, this.config.timeout);

    this.map.set(id, handler);
    return handler.timeout;
  }

  private clearTimeout(id: string) {
    const handler = this.map.get(id);
    if (!handler) return;
    clearTimeout(handler.timeout!);
    handler.timeout = undefined;
    this.map.set(id, handler);
  }
}
