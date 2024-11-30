import EventEmitter from "events";

interface EventMap {
  start: [];
  pause: [];
  resume: [];
  stop: [];
  cancel: [];
  loop: [];
}

export class PauseableLoop extends EventEmitter<EventMap> {
  private timeout: NodeJS.Immediate | null = null;
  private isRunning = false;
  private isPaused = false;
  private isCancelled = false;
  private subCallback: (() => void) | null = null;
  constructor(private callback: () => void) {
    super();
  }

  start(callback?: () => void) {
    this.emit("start");
    if (callback) this.subCallback = callback;
    if (this.isRunning) return;
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
    if (!this.isPaused) return;
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

  private loop() {
    if (this.isCancelled || !this.isRunning) return;
    this.emit("loop");
    this.timeout = setImmediate(() => {
      if (this.isPaused) return;
      this.callback();
      this.subCallback && this.subCallback();
      this.loop();
    });
  }

  clear() {
    if (this.timeout) clearImmediate(this.timeout);
  }
}
