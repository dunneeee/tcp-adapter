"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PauseableLoop = void 0;
const events_1 = __importDefault(require("events"));
class PauseableLoop extends events_1.default {
    constructor(callback) {
        super();
        this.callback = callback;
        this.timeout = null;
        this.isRunning = false;
        this.isPaused = false;
        this.isCancelled = false;
        this.subCallback = null;
    }
    start(callback) {
        this.emit("start");
        if (callback)
            this.subCallback = callback;
        if (this.isRunning)
            return;
        this.isRunning = true;
        this.loop();
    }
    pause() {
        this.emit("pause");
        this.isPaused = true;
        this.clear();
    }
    resume() {
        this.emit("resume");
        if (!this.isPaused)
            return;
        this.isPaused = false;
        this.loop();
    }
    stop() {
        this.emit("stop");
        this.isRunning = false;
        this.clear();
    }
    cancel() {
        this.emit("cancel");
        this.isCancelled = true;
        this.stop();
    }
    loop() {
        if (this.isCancelled || !this.isRunning)
            return;
        this.emit("loop");
        this.timeout = setImmediate(() => {
            if (this.isPaused)
                return;
            this.callback();
            this.subCallback && this.subCallback();
            this.loop();
        });
    }
    clear() {
        if (this.timeout)
            clearImmediate(this.timeout);
    }
}
exports.PauseableLoop = PauseableLoop;
//# sourceMappingURL=PauseableLoop.js.map