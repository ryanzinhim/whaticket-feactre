"use strict";
exports.__esModule = true;
var mustache_1 = require("mustache");
exports["default"] = (function (body, contact) {
    var view = {
        name: contact ? contact.name : ""
    };
    return mustache_1["default"].render(body, view);
});
