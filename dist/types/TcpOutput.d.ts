import { Packet } from "./Packet";
import { PauseableLoop } from "./PauseableLoop";
import { TcpAdapter } from "./TcpAdapter";
export declare class TcpOutput {
    private adapter;
    constructor(adapter: TcpAdapter);
    send<T>(packet: Packet<T>, silent?: boolean): Promise<void>;
    send<T>(data: T, silent?: boolean): Promise<void>;
    request<R = any, T = any>(data: T, type: number): Promise<R>;
    request<R = any, T = any>(data: T, type: number, id: string): Promise<R>;
    request<R = any, T = any>(data: T, id: string): Promise<R>;
    request<R = any, T = any>(packet: Packet<T>, id: string): Promise<R>;
    request<R = any, T = any>(packet: Packet<T>): Promise<R>;
    request<R = any, T = any>(data: T): Promise<R>;
    requestWithTimeout<R = any, T = any>(data: T, type: number, timeout: number | null): Promise<R>;
    requestWithTimeout<R = any, T = any>(packet: Packet<T>, timeout: number | null): Promise<R>;
    stream(id: number, filePath: string, type?: number): {
        loop: PauseableLoop;
        getLength: () => number;
    };
}
