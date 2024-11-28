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
    register(resolve: Function, reject: Function, id: string): string;
    register(resolve: Function, reject: Function): string;
    registerWithTimeout(resolve: Function, reject: Function, timeout: number | null): string;
    registerWithTimeout(resolve: Function, reject: Function, timeout: number | null, id: string): void;
    resolve<T>(id: string, data: T): void;
    reject(id: string, error: Error): void;
    clear(): void;
    clearQuietly(): void;
    getPendingHandlers(): Map<string, PendingHandler>;
    getPendingHandler(id: string): PendingHandler | undefined;
}
