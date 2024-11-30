import EventEmitter from "events";
interface EventMap {
    start: [];
    pause: [];
    resume: [];
    stop: [];
    cancel: [];
    loop: [];
}
export declare class PauseableLoop extends EventEmitter<EventMap> {
    private callback;
    private timeout;
    private isRunning;
    private isPaused;
    private isCancelled;
    private subCallback;
    constructor(callback: () => void);
    start(callback?: () => void): void;
    pause(): void;
    resume(): void;
    stop(): void;
    cancel(): void;
    private loop;
    clear(): void;
}
export {};
