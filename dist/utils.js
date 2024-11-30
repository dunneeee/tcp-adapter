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
exports.stringToCodePoints = stringToCodePoints;
exports.codePointsToString = codePointsToString;
exports.sumCodePoints = sumCodePoints;
exports.isUUID = isUUID;
exports.getFileInfo = getFileInfo;
exports.isFileInfo = isFileInfo;
exports.isFilePacket = isFilePacket;
exports.isFileChunk = isFileChunk;
exports.generateFilepath = generateFilepath;
exports.createFileIfNotExists = createFileIfNotExists;
const fs_1 = require("fs");
const Packet_1 = require("./Packet");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = require("path");
function stringToCodePoints(str) {
    return Array.from(str).map((char) => char.charCodeAt(0));
}
function codePointsToString(codePoints) {
    return String.fromCodePoint(...codePoints);
}
function sumCodePoints(str) {
    return stringToCodePoints(str).reduce((acc, codePoint) => acc + codePoint, 0);
}
function isUUID(str) {
    return /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(str);
}
function getFileInfo(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathParts = filePath.split(process.platform === "win32" ? "\\" : "/");
        const fileName = pathParts[pathParts.length - 1];
        const size = yield promises_1.default.stat(filePath).then((stat) => stat.size);
        return {
            name: fileName,
            size,
            type: fileName.split(".")[1],
            path: filePath,
        };
    });
}
function isFileInfo(data) {
    return (typeof data === "object" &&
        "name" in data &&
        "size" in data &&
        "type" in data &&
        "path" in data);
}
function isFilePacket(packet) {
    return packet.type === Packet_1.PacketTypeDefault.File;
}
function isFileChunk(data) {
    return typeof data === "object" && "chunk" in data && "id" in data;
}
function generateFilepath(path) {
    if ((0, fs_1.existsSync)(path)) {
        const parts = path.split(".");
        const ext = parts.pop();
        return (parts.join(".") + Math.random().toString(36).substring(2) + "." + ext);
    }
    return path;
}
function createFileIfNotExists(path) {
    const dir = (0, path_1.dirname)(path);
    if (!(0, fs_1.existsSync)(dir)) {
        promises_1.default.mkdir(dir, { recursive: true });
    }
    if (!(0, fs_1.existsSync)(path)) {
        promises_1.default.writeFile(path, "");
    }
}
//# sourceMappingURL=utils.js.map