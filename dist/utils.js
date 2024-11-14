"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToCodePoints = stringToCodePoints;
exports.codePointsToString = codePointsToString;
exports.sumCodePoints = sumCodePoints;
function stringToCodePoints(str) {
    return Array.from(str).map((char) => char.charCodeAt(0));
}
function codePointsToString(codePoints) {
    return String.fromCodePoint(...codePoints);
}
function sumCodePoints(str) {
    return stringToCodePoints(str).reduce((acc, codePoint) => acc + codePoint, 0);
}
//# sourceMappingURL=utils.js.map