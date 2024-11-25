"use strict";
const buffer = Buffer.from("Hello, World!");
function test(data) {
    const result = data.subarray(0, 4);
    console.log(result.toString());
    console.log(data.toString());
}
test(buffer);
console.log(buffer.toString());
//# sourceMappingURL=index.test.js.map