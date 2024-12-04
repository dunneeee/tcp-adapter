export declare class Queue<T> {
    private process;
    private queue;
    private isProcessing;
    constructor(process: (item: T) => Promise<void>);
    add(item: T): void;
    processQueue(): Promise<void>;
    get length(): number;
}
