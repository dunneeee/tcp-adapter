export interface Transformer<T> {
    encode(data: T): Buffer;
    decode(data: Buffer): T[];
}
