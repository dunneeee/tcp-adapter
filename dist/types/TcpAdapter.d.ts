import { Socket } from "net";
import { DataResolver } from "./DataResolver";
import EventEmitter from "events";
import { Transformer } from "./Transformer";
import { Packet } from "./Packet";
import { PacketProcess } from "./PacketProcess";
export interface TcpAdapterContext {
    dataResolver: DataResolver;
    packetTransformer: Transformer<Packet>;
    packetProcess: PacketProcess;
}
export interface TcpAdapterEventMap {
    error: [unknown, Packet?];
    disconnect: [boolean];
    packet: [Packet];
    data: [Buffer];
    packet_in_resolving: [Packet];
    packet_out_resolving: [Packet | null, Error | null];
}
export declare class TcpAdapter extends EventEmitter<TcpAdapterEventMap> {
    private socket;
    private dataResolver;
    private packetTransformer;
    private packetProcess;
    constructor(socket: Socket, context?: Partial<TcpAdapterContext>);
    private handleSocketError;
    private handleSocketDisconnect;
    private handleSocketData;
    canWrite(): boolean;
    getSocket(): Socket;
    getDataResolver(): DataResolver;
    getPacketTransformer(): Transformer<Packet<any>>;
    private init;
}
