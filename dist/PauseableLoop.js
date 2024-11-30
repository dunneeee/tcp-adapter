"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PauseableLoop = void 0;
class PauseableLoop {
    constructor(callback, interval) {
        this.callback = callback;
        this.interval = interval;
        this.timeout = null;
        this.isRunning = false;
        this.isPaused = false;
        this.isCancelled = false;
        this.subCallback = null;
    }
    start(callback) {
        if (callback)
            this.subCallback = callback;
        if (this.isRunning)
            return;
        this.isRunning = true;
        this.loop();
    }
    pause() {
        this.isPaused = true;
        if (this.timeout)
            clearTimeout(this.timeout);
    }
    resume() {
        if (!this.isPaused)
            return;
        this.isPaused = false;
        this.loop();
    }
    stop() {
        this.isRunning = false;
        if (this.timeout)
            clearTimeout(this.timeout);
    }
    cancel() {
        this.isCancelled = true;
        this.stop();
    }
    loop() {
        if (this.isCancelled || !this.isRunning)
            return;
        this.timeout = setTimeout(() => {
            if (this.isPaused)
                return;
            this.callback();
            this.subCallback && this.subCallback();
            this.loop();
        }, this.interval);
    }
}
exports.PauseableLoop = PauseableLoop;
//# sourceMappingURL=PauseableLoop.js.map