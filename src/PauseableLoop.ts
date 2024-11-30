export class PauseableLoop {
  private timeout: NodeJS.Timeout | null = null;
  private isRunning = false;
  private isPaused = false;
  private isCancelled = false;
  private subCallback: (() => void) | null = null;
  constructor(private callback: () => void, private interval: number) {}

  start(callback?: () => void) {
    if (callback) this.subCallback = callback;
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  pause() {
    this.isPaused = true;
    if (this.timeout) clearTimeout(this.timeout);
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.timeout) clearTimeout(this.timeout);
  }

  cancel() {
    this.isCancelled = true;
    this.stop();
  }

  private loop() {
    if (this.isCancelled || !this.isRunning) return;
    this.timeout = setTimeout(() => {
      if (this.isPaused) return;
      this.callback();
      this.subCallback && this.subCallback();
      this.loop();
    }, this.interval);
  }
}
