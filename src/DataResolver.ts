import { randomUUID } from "crypto";

export interface PendingHandler {
  resolve: Function;
  reject: Function;
  timeout: NodeJS.Timeout;
}

export interface DataResolverConfig {
  timeout: number;
}

export class DataResolver {
  private pendingHandlers: Map<string, PendingHandler> = new Map();
  private config: DataResolverConfig;
  constructor(config: Partial<DataResolverConfig> = {}) {
    this.config = {
      timeout: 60000,
      ...config,
    };
  }

  public register(resolve: Function, reject: Function, id: string): string;
  public register(resolve: Function, reject: Function): string;
  public register(
    resolve: Function,
    reject: Function,
    id?: string
  ): string | void {
    id = id || randomUUID();

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

  public registerWithTimeout(
    resolve: Function,
    reject: Function,
    timeout: number | null
  ): string;
  public registerWithTimeout(
    resolve: Function,
    reject: Function,
    timeout: number | null,
    id: string
  ): void;
  public registerWithTimeout(
    resolve: Function,
    reject: Function,
    timeout: number | null = this.config.timeout,
    id?: string
  ): string | void {
    id = id || randomUUID();

    let timeoutId: NodeJS.Timeout = {} as NodeJS.Timeout;

    if (timeout) {
      timeoutId = setTimeout(() => {
        this.reject(id!, new Error("TIMEOUT"));
      }, timeout || this.config.timeout);
    }

    this.pendingHandlers.set(id!, {
      resolve,
      reject,
      timeout: timeoutId,
    });

    return id;
  }

  public resolve<T>(id: string, data: T): void {
    const handler = this.pendingHandlers.get(id);
    if (handler) {
      clearTimeout(handler.timeout);
      handler.resolve(data);
      this.pendingHandlers.delete(id);
    }
  }

  public reject(id: string, error: Error): void {
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

  public getPendingHandlers(): Map<string, PendingHandler> {
    return this.pendingHandlers;
  }

  public getPendingHandler(id: string): PendingHandler | undefined {
    return this.pendingHandlers.get(id);
  }
}
