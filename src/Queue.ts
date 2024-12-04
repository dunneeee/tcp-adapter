export class Queue<T> {
  private queue: T[] = [];
  private isProcessing = false;

  constructor(private process: (item: T) => Promise<void>) {}

  add(item: T) {
    this.queue.push(item);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    while (this.queue.length) {
      const item = this.queue.shift();
      if (!item) continue;
      await this.process(item);
    }
    this.isProcessing = false;
  }

  get length() {
    return this.queue.length;
  }
}
