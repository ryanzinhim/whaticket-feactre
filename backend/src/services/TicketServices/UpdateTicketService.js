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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var CheckContactOpenTickets_1 = require("../../helpers/CheckContactOpenTickets");
var SetTicketMessagesAsRead_1 = require("../../helpers/SetTicketMessagesAsRead");
var socket_1 = require("../../libs/socket");
var ShowTicketService_1 = require("./ShowTicketService");
var UpdateTicketService = function (_a) {
    var ticketData = _a.ticketData, ticketId = _a.ticketId;
    return __awaiter(void 0, void 0, void 0, function () {
        var status, userId, queueId, whatsappId, ticket, oldStatus, oldUserId, io;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    status = ticketData.status, userId = ticketData.userId, queueId = ticketData.queueId, whatsappId = ticketData.whatsappId;
                    return [4 /*yield*/, ShowTicketService_1["default"](ticketId)];
                case 1:
                    ticket = _d.sent();
                    return [4 /*yield*/, SetTicketMessagesAsRead_1["default"](ticket)];
                case 2:
                    _d.sent();
                    if (!(whatsappId && ticket.whatsappId !== whatsappId)) return [3 /*break*/, 4];
                    return [4 /*yield*/, CheckContactOpenTickets_1["default"](ticket.contactId, whatsappId)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    oldStatus = ticket.status;
                    oldUserId = (_b = ticket.user) === null || _b === void 0 ? void 0 : _b.id;
                    if (!(oldStatus === "closed")) return [3 /*break*/, 6];
                    return [4 /*yield*/, CheckContactOpenTickets_1["default"](ticket.contact.id, ticket.whatsappId)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: return [4 /*yield*/, ticket.update({
                        status: status,
                        queueId: queueId,
                        userId: userId
                    })];
                case 7:
                    _d.sent();
                    if (!whatsappId) return [3 /*break*/, 9];
                    return [4 /*yield*/, ticket.update({
                            whatsappId: whatsappId
                        })];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [4 /*yield*/, ticket.reload()];
                case 10:
                    _d.sent();
                    io = socket_1.getIO();
                    if (ticket.status !== oldStatus || ((_c = ticket.user) === null || _c === void 0 ? void 0 : _c.id) !== oldUserId) {
                        io.to(oldStatus).emit("ticket", {
                            action: "delete",
                            ticketId: ticket.id
                        });
                    }
                    io.to(ticket.status)
                        .to("notification")
                        .to(ticketId.toString())
                        .emit("ticket", {
                        action: "update",
                        ticket: ticket
                    });
                    return [2 /*return*/, { ticket: ticket, oldStatus: oldStatus, oldUserId: oldUserId }];
            }
        });
    });
};
exports["default"] = UpdateTicketService;
