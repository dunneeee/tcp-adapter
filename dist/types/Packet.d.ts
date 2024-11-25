import { Convertible } from "./Convertible";
import { PacketOutput } from "./PacketOutput";
import { TcpAdapter } from "./TcpAdapter";
export declare enum PacketTypeDefault {
    Error = 0,
    Data = 1,
    File = 416
}
export type PacketType = PacketTypeDefault | number;
export type PacketSerializable<T> = {
    type: PacketType;
    data: T;
    id: number | string;
};
export declare function isPacketSerializable<T>(obj: any): obj is PacketSerializable<T>;
export declare class Packet<T = any> implements Convertible<PacketSerializable<T>> {
    type: PacketType;
    data: T;
    id: string;
    isFeedback: boolean;
    constructor(data: T, type: PacketType, id: string);
    constructor(data: T, type: PacketType);
    constructor(id: string, data: T);
    constructor(data: T);
    toBuffer(): Buffer;
    toPlainObject(): PacketSerializable<T>;
    newOutput(adapter: TcpAdapter): PacketOutput;
    markAsFeedBack(): this;
    unMarkAsFeedBack(): this;
    setFeedback(value: boolean): this;
}
