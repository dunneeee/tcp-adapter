import { Packet, PacketTypeDefault } from "./Packet";
import { FileInfo } from "./types";
import fs from "fs/promises";

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
  const pathParts = filePath.split("/");
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
