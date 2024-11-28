import { Packet } from "./Packet";
import { TcpAdapter } from "./TcpAdapter";
export interface FileProcessConfig {
    rootFolder: string;
    timeout?: number;
}
export declare class FileProcess {
    config: FileProcessConfig;
    private map;
    constructor(config: FileProcessConfig);
    process(packet: Packet, adapter: TcpAdapter): Promise<Packet<string>>;
    private createTimeout;
    private clearTimeout;
}
