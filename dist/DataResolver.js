"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResolver = void 0;
const crypto_1 = require("crypto");
class DataResolver {
    constructor(config = {}) {
        this.pendingHandlers = new Map();
        this.config = Object.assign({ timeout: 60000 }, config);
    }
    register(resolve, reject, id) {
        id = id || (0, crypto_1.randomUUID)();
        const timeout = setTimeout(() => {
            this.reject(id, new Error("TIMEOUT"));
        }, this.config.timeout);
        this.pendingHandlers.set(id, {
            resolve,
            reject,
            timeout,
        });
        return id;
    }
    registerWithTimeout(resolve, reject, timeout = this.config.timeout, id) {
        id = id || (0, crypto_1.randomUUID)();
        let timeoutId = {};
        if (timeout) {
            timeoutId = setTimeout(() => {
                this.reject(id, new Error("TIMEOUT"));
            }, timeout || this.config.timeout);
        }
        this.pendingHandlers.set(id, {
            resolve,
            reject,
            timeout: timeoutId,
        });
        return id;
    }
    resolve(id, data) {
        const handler = this.pendingHandlers.get(id);
        if (handler) {
            clearTimeout(handler.timeout);
            handler.resolve(data);
            this.pendingHandlers.delete(id);
        }
    }
    reject(id, error) {
        const handler = this.pendingHandlers.get(id);
        if (handler) {
            clearTimeout(handler.timeout);
            handler.reject(error);
            this.pendingHandlers.delete(id);
        }
    }
    clear() {
        this.pendingHandlers.forEach((handler) => {
            clearTimeout(handler.timeout);
            handler.reject(new Error("Clear all pending handlers"));
        });
        this.pendingHandlers.clear();
    }
    clearQuietly() {
        this.pendingHandlers.forEach((handler) => {
            clearTimeout(handler.timeout);
        });
        this.pendingHandlers.clear();
    }
    getPendingHandlers() {
        return this.pendingHandlers;
    }
    getPendingHandler(id) {
        return this.pendingHandlers.get(id);
    }
}
exports.DataResolver = DataResolver;
//# sourceMappingURL=DataResolver.js.map