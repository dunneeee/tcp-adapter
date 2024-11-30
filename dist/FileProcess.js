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
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
class FileProcess {
    constructor(config) {
        this.config = config;
        this.map = new Map();
    }
    process(packet, adapter) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = packet.id;
            if (!this.map.has(id)) {
                if (!(0, utils_1.isFileInfo)(packet.data))
                    throw new Error("INVALID_DATA");
                const filePath = (0, utils_1.generateFilepath)(path_1.default.resolve(this.config.rootFolder, packet.data.name));
                (0, utils_1.createFileIfNotExists)(filePath);
                const writeStream = (0, fs_1.createWriteStream)(filePath);
                this.map.set(id, {
                    info: packet.data,
                    writeStream,
                });
                this.createTimeout(id);
                return packet.newOutput(adapter).response(id);
            }
            const handler = this.map.get(id);
            if (!handler)
                throw new Error("NOT_FOUND");
            this.clearTimeout(id);
            if (!packet.data) {
                handler.writeStream.end();
                this.map.delete(id);
                return packet.newOutput(adapter).response(constants_1.ACK);
            }
            handler.writeStream.write(Buffer.from(packet.data));
            this.createTimeout(id);
            return packet.newOutput(adapter).response(constants_1.ACK);
        });
    }
    createTimeout(id) {
        const handler = this.map.get(id);
        if (!handler || !this.config.timeout)
            return;
        if (handler.timeout) {
            clearTimeout(handler.timeout);
        }
        handler.timeout = setTimeout(() => {
            this.map.delete(id);
            handler.writeStream.close();
        }, this.config.timeout);
        this.map.set(id, handler);
        return handler.timeout;
    }
    clearTimeout(id) {
        const handler = this.map.get(id);
        if (!handler)
            return;
        clearTimeout(handler.timeout);
        handler.timeout = undefined;
        this.map.set(id, handler);
    }
}
exports.FileProcess = FileProcess;
//# sourceMappingURL=FileProcess.js.map