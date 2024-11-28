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
