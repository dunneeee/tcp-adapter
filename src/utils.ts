export function stringToCodePoints(str: string): number[] {
  return Array.from(str).map((char) => char.charCodeAt(0));
}

export function codePointsToString(codePoints: number[]): string {
  return String.fromCodePoint(...codePoints);
}

export function sumCodePoints(str: string): number {
  return stringToCodePoints(str).reduce((acc, codePoint) => acc + codePoint, 0);
}
