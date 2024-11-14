export interface PendingHandler {
    resolve: Function;
    reject: Function;
    timeout: NodeJS.Timeout;
}
export interface DataResolverConfig {
    timeout: number;
}
export declare class DataResolver {
    private pendingHandlers;
    private config;
    constructor(config?: Partial<DataResolverConfig>);
    register(resolve: Function, reject: Function, id: string): void;
    register(resolve: Function, reject: Function): string;
    resolve<T>(id: string, data: T): void;
    reject(id: string, error: Error): void;
    clear(): void;
    clearQuietly(): void;
    getPendingHandlers(): Map<string, PendingHandler>;
    getPendingHandler(id: string): PendingHandler | undefined;
}
