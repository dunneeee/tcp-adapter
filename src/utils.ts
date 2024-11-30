import { existsSync } from "fs";
import { Packet, PacketTypeDefault } from "./Packet";
import { FileChunk, FileInfo } from "./types";
import fs from "fs/promises";
import { dirname } from "path";

export function stringToCodePoints(str: string): number[] {
  return Array.from(str).map((char) => char.charCodeAt(0));
}

export function codePointsToString(codePoints: number[]): string {
  return String.fromCodePoint(...codePoints);
}

export function sumCodePoints(str: string): number {
  return stringToCodePoints(str).reduce((acc, codePoint) => acc + codePoint, 0);
}

export function isUUID(str: string): boolean {
  return /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(str);
}

export async function getFileInfo(filePath: string): Promise<FileInfo> {
  const pathParts = filePath.split(process.platform === "win32" ? "\\" : "/");
  const fileName = pathParts[pathParts.length - 1];
  const size = await fs.stat(filePath).then((stat) => stat.size);
  return {
    name: fileName,
    size,
    type: fileName.split(".")[1],
    path: filePath,
  };
}

export function isFileInfo(data: any): data is FileInfo {
  return (
    typeof data === "object" &&
    "name" in data &&
    "size" in data &&
    "type" in data &&
    "path" in data
  );
}

export function isFilePacket(packet: Packet) {
  return packet.type === PacketTypeDefault.File;
}

export function isFileChunk(data: any): data is FileChunk {
  return typeof data === "object" && "chunk" in data && "id" in data;
}

export function generateFilepath(path: string): string {
  if (existsSync(path)) {
    const parts = path.split(".");
    const ext = parts.pop();
    return (
      parts.join(".") + Math.random().toString(36).substring(2) + "." + ext
    );
  }

  return path;
}

export function createFileIfNotExists(path: string) {
  const dir = dirname(path);

  if (!existsSync(dir)) {
    fs.mkdir(dir, { recursive: true });
  }

  if (!existsSync(path)) {
    fs.writeFile(path, "");
  }
}
