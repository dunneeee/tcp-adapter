"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    constructor(process) {
        this.process = process;
        this.queue = [];
        this.isProcessing = false;
    }
    add(item) {
        this.queue.push(item);
        this.processQueue();
    }
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isProcessing)
                return;
            this.isProcessing = true;
            while (this.queue.length) {
                const item = this.queue.shift();
                if (!item)
                    continue;
                yield this.process(item);
            }
            this.isProcessing = false;
        });
    }
    get length() {
        return this.queue.length;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=Queue.js.map