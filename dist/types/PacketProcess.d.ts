import { Packet } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";
export declare class PacketProcess {
    private adapter;
    constructor(adapter: TcpAdapter);
    process(packets: Packet[]): void;
    protected handle(packet: Packet): boolean | void;
    protected handleSpecialPacket(packet: Packet): boolean;
    protected handleNormalPacket(packet: Packet): void;
}
