export interface PendingHandler {
  resolve: Function;
  reject: Function;
  timeout: NodeJS.Timeout;
}

export interface DataResolverConfig {
  timeout: number;
}

export class DataResolver {
  private pendingHandlers: Map<number, PendingHandler> = new Map();
  private config: DataResolverConfig;
  private countId = 1;
  constructor(config: Partial<DataResolverConfig> = {}) {
    this.config = {
      timeout: 60000,
      ...config,
    };
  }

  public register(resolve: Function, reject: Function, id: number): void;
  public register(resolve: Function, reject: Function): number;
  public register(
    resolve: Function,
    reject: Function,
    id?: number
  ): number | void {
    id = id || this.countId++;

    const timeout = setTimeout(() => {
      this.reject(id!, new Error("TIMEOUT"));
    }, this.config.timeout);

    this.pendingHandlers.set(id!, {
      resolve,
      reject,
      timeout,
    });

    return id;
  }

  public resolve<T>(id: number, data: T): void {
    const handler = this.pendingHandlers.get(id);
    if (handler) {
      clearTimeout(handler.timeout);
      handler.resolve(data);
      this.pendingHandlers.delete(id);
    }
  }

  public reject(id: number, error: Error): void {
    const handler = this.pendingHandlers.get(id);
    if (handler) {
      clearTimeout(handler.timeout);
      handler.reject(error);
      this.pendingHandlers.delete(id);
    }
  }

  public clear(): void {
    this.pendingHandlers.forEach((handler) => {
      clearTimeout(handler.timeout);
      handler.reject(new Error("Clear all pending handlers"));
    });
    this.pendingHandlers.clear();
  }

  public clearQuietly(): void {
    this.pendingHandlers.forEach((handler) => {
      clearTimeout(handler.timeout);
    });
    this.pendingHandlers.clear();
  }

  public getPendingHandlers(): Map<number, PendingHandler> {
    return this.pendingHandlers;
  }

  public getPendingHandler(id: number): PendingHandler | undefined {
    return this.pendingHandlers.get(id);
  }
}
