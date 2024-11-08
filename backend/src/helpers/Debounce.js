"use strict";
exports.__esModule = true;
exports.debounce = void 0;
var timeouts = [];
var findAndClearTimeout = function (ticketId) {
    if (timeouts.length > 0) {
        var timeoutIndex = timeouts.findIndex(function (timeout) { return timeout.id === ticketId; });
        if (timeoutIndex !== -1) {
            clearTimeout(timeouts[timeoutIndex].timeout);
            timeouts.splice(timeoutIndex, 1);
        }
    }
};
var debounce = function (func, wait, ticketId) {
    return function executedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var later = function () {
            findAndClearTimeout(ticketId);
            func.apply(void 0, args);
        };
        findAndClearTimeout(ticketId);
        var newTimeout = {
            id: ticketId,
            timeout: setTimeout(later, wait)
        };
        timeouts.push(newTimeout);
    };
};
exports.debounce = debounce;
