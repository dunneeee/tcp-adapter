import { Packet } from "./Packet";
export interface Convertible<T> {
    toBuffer(): Buffer;
    toPlainObject(): T;
}
export interface PacketConvertible<T> {
    toPacket(type: number): Packet<T>;
}
