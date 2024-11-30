import { WriteStream } from "fs";
export type FileCallbackParams = {
    chunk: Buffer;
    length: number;
};
export type FileInfo = {
    name: string;
    size: number;
    type: string;
    path: string;
};
export type FileWriteInfo = {
    info: FileInfo;
    stream: WriteStream;
    length: number;
    path: string;
    timeout: NodeJS.Timeout;
};
export type FileChunk = {
    id: string;
    chunk: Buffer | null;
};
