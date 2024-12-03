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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcess = void 0;
const fs_1 = require("fs");
const utils_1 = require("./utils");
const crypto_1 = require("crypto");
const events_1 = __importDefault(require("events"));
class FileProcess extends events_1.default {
    constructor() {
        super(...arguments);
        this.map = new Map();
    }
    process(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, utils_1.isFileChunk)(packet.data)) {
                const { chunk, id } = packet.data;
                this.setTimeout(id);
                const info = this.map.get(id);
                if (!info || !chunk)
                    return;
                const bufferChunk = Buffer.from(chunk);
                info.stream.write(bufferChunk);
                info.length += bufferChunk.length;
                this.emit("data", { chunk, length: info.length, info: info.info, id });
                if (info.length >= info.info.size) {
                    this.emit("end", info.info, id);
                    info.stream.end();
                    if (info.timeout)
                        clearTimeout(info.timeout);
                    this.map.delete(id);
                }
            }
        });
    }
    createStream(info) {
        const path = (0, utils_1.generateFilepath)(info.path);
        const stream = (0, fs_1.createWriteStream)(path);
        const id = (0, crypto_1.randomUUID)();
        info.path = path;
        this.map.set(id, {
            stream,
            info,
            length: 0,
            path,
            timeout: null,
        });
        this.setTimeout(id);
        return id;
    }
    cleanStream(id) {
        const info = this.map.get(id);
        if (!info)
            return;
        info.stream.end();
        if (info.timeout)
            clearTimeout(info.timeout);
        this.map.delete(id);
    }
    setTimeout(id) {
        const info = this.map.get(id);
        if (!info)
            return;
        if (info.timeout)
            clearTimeout(info.timeout);
        info.timeout = setTimeout(() => {
            info.stream.end();
            this.map.delete(id);
            this.emit("error", new Error("TIMEOUT"), info.info, id);
        }, 1000 * 60 * 5);
        return info.timeout;
    }
}
exports.FileProcess = FileProcess;
//# sourceMappingURL=FileProcess.js.map