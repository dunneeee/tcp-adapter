import { Packet } from "./Packet";
import { FileChunk, FileInfo } from "./types";
import EventEmitter from "events";
interface EventMap {
    end: [FileInfo, id: string];
    error: [Error, info: FileInfo, id: string];
    data: [{
        chunk: Buffer;
        length: number;
        info: FileInfo;
        id: string;
    }];
}
export declare class FileProcess extends EventEmitter<EventMap> {
    private map;
    process(packet: Packet<FileChunk>): Promise<void>;
    createStream(info: FileInfo): `${string}-${string}-${string}-${string}-${string}`;
    cleanStream(id: string): void;
    private setTimeout;
}
export {};
