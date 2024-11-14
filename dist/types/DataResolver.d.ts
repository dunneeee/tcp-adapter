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
    private countId;
    constructor(config?: Partial<DataResolverConfig>);
    register(resolve: Function, reject: Function, id: number): void;
    register(resolve: Function, reject: Function): number;
    resolve<T>(id: number, data: T): void;
    reject(id: number, error: Error): void;
    clear(): void;
    clearQuietly(): void;
    getPendingHandlers(): Map<number, PendingHandler>;
    getPendingHandler(id: number): PendingHandler | undefined;
}
