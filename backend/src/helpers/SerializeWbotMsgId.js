"use strict";
exports.__esModule = true;
var SerializeWbotMsgId = function (ticket, message) {
    var serializedMsgId = message.fromMe + "_" + ticket.contact.number + "@" + (ticket.isGroup ? "g" : "c") + ".us_" + message.id;
    return serializedMsgId;
};
exports["default"] = SerializeWbotMsgId;
