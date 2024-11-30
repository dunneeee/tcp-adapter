import { Packet } from "./Packet";
import { FileInfo } from "./types";
export declare function stringToCodePoints(str: string): number[];
export declare function codePointsToString(codePoints: number[]): string;
export declare function sumCodePoints(str: string): number;
export declare function isUUID(str: string): boolean;
export declare function getFileInfo(filePath: string): Promise<FileInfo>;
export declare function isFileInfo(data: any): data is FileInfo;
export declare function isFilePacket(packet: Packet): boolean;
export declare function generateFilepath(path: string): string;
export declare function createFileIfNotExists(path: string): void;
