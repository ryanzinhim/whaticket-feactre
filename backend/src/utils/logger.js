"use strict";
exports.__esModule = true;
exports.logger = void 0;
var pino_1 = require("pino");
var logger = pino_1["default"]({
    prettyPrint: {
        ignore: "pid,hostname"
    }
});
exports.logger = logger;
