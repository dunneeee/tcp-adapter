import { Packet } from "./Packet";
import { FileChunk, FileInfo } from "./types";
import EventEmitter from "events";
interface EventMap {
    end: [FileInfo];
    error: [Error];
    data: [{
        chunk: Buffer;
        length: number;
        info: FileInfo;
    }];
}
export declare class FileProcess extends EventEmitter<EventMap> {
    private map;
    process(packet: Packet<FileChunk>): Promise<void>;
    createStream(info: FileInfo): `${string}-${string}-${string}-${string}-${string}`;
    private setTimeout;
}
export {};
