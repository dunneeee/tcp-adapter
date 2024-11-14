import { Packet } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";
export declare class TcpOutput {
    private adapter;
    constructor(adapter: TcpAdapter);
    send<T>(packet: Packet<T>, silent?: boolean): Promise<void>;
    send<T>(data: T, silent?: boolean): Promise<void>;
    request<R = any, T = any>(data: T, type: number): Promise<R>;
    request<R = any, T = any>(packet: Packet<T>): Promise<R>;
}
