import { Convertible } from "./Convertible";
import { PacketOutput } from "./PacketOutput";
import { TcpAdapter } from "./TcpAdapter";
export declare enum PacketTypeDefault {
    Error = 0,
    Data = 1
}
export type PacketType = PacketTypeDefault | number;
export type PacketSerializable<T> = {
    type: PacketType;
    data: T;
    id: number;
};
export declare function isPacketSerializable<T>(obj: any): obj is PacketSerializable<T>;
export declare class Packet<T = any> implements Convertible<PacketSerializable<T>> {
    type: PacketType;
    data: T;
    id: number;
    constructor(data: T, type: PacketType, id: number);
    constructor(data: T, type: PacketType);
    constructor(id: number, data: T);
    constructor(data: T);
    toBuffer(): Buffer;
    toPlainObject(): PacketSerializable<T>;
    newOutput(adapter: TcpAdapter): PacketOutput;
}
