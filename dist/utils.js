"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToCodePoints = stringToCodePoints;
exports.codePointsToString = codePointsToString;
exports.sumCodePoints = sumCodePoints;
exports.isUUID = isUUID;
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
//# sourceMappingURL=utils.js.map