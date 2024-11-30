export declare class PauseableLoop {
    private callback;
    private interval;
    private timeout;
    private isRunning;
    private isPaused;
    private isCancelled;
    private subCallback;
    constructor(callback: () => void, interval: number);
    start(callback?: () => void): void;
    pause(): void;
    resume(): void;
    stop(): void;
    cancel(): void;
    private loop;
}
