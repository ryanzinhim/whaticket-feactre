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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.handleMessage = exports.wbotMessageListener = void 0;
var path_1 = require("path");
var util_1 = require("util");
var fs_1 = require("fs");
var Sentry = require("@sentry/node");
var Message_1 = require("../../models/Message");
var socket_1 = require("../../libs/socket");
var CreateMessageService_1 = require("../MessageServices/CreateMessageService");
var logger_1 = require("../../utils/logger");
var CreateOrUpdateContactService_1 = require("../ContactServices/CreateOrUpdateContactService");
var FindOrCreateTicketService_1 = require("../TicketServices/FindOrCreateTicketService");
var ShowWhatsAppService_1 = require("../WhatsappService/ShowWhatsAppService");
var Debounce_1 = require("../../helpers/Debounce");
var UpdateTicketService_1 = require("../TicketServices/UpdateTicketService");
var CreateContactService_1 = require("../ContactServices/CreateContactService");
var Mustache_1 = require("../../helpers/Mustache");
var writeFileAsync = util_1.promisify(fs_1.writeFile);
var verifyContact = function (msgContact) { return __awaiter(void 0, void 0, void 0, function () {
    var profilePicUrl, contactData, contact;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, msgContact.getProfilePicUrl()];
            case 1:
                profilePicUrl = _a.sent();
                contactData = {
                    name: msgContact.name || msgContact.pushname || msgContact.id.user,
                    number: msgContact.id.user,
                    profilePicUrl: profilePicUrl,
                    isGroup: msgContact.isGroup
                };
                contact = CreateOrUpdateContactService_1["default"](contactData);
                return [2 /*return*/, contact];
        }
    });
}); };
var verifyQuotedMessage = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var wbotQuotedMsg, quotedMsg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!msg.hasQuotedMsg)
                    return [2 /*return*/, null];
                return [4 /*yield*/, msg.getQuotedMessage()];
            case 1:
                wbotQuotedMsg = _a.sent();
                return [4 /*yield*/, Message_1["default"].findOne({
                        where: { id: wbotQuotedMsg.id.id }
                    })];
            case 2:
                quotedMsg = _a.sent();
                if (!quotedMsg)
                    return [2 /*return*/, null];
                return [2 /*return*/, quotedMsg];
        }
    });
}); };
// generate random id string for file names, function got from: https://stackoverflow.com/a/1349426/1851801
function makeRandomId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
var verifyMediaMessage = function (msg, ticket, contact) { return __awaiter(void 0, void 0, void 0, function () {
    var quotedMsg, media, randomId, ext, err_1, messageData, newMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, verifyQuotedMessage(msg)];
            case 1:
                quotedMsg = _a.sent();
                return [4 /*yield*/, msg.downloadMedia()];
            case 2:
                media = _a.sent();
                if (!media) {
                    throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
                }
                randomId = makeRandomId(5);
                if (!media.filename) {
                    ext = media.mimetype.split("/")[1].split(";")[0];
                    media.filename = randomId + "-" + new Date().getTime() + "." + ext;
                }
                else {
                    media.filename = media.filename.split('.').slice(0, -1).join('.') + '.' + randomId + '.' + media.filename.split('.').slice(-1);
                }
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, writeFileAsync(path_1.join(__dirname, "..", "..", "..", "public", media.filename), media.data, "base64")];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                Sentry.captureException(err_1);
                logger_1.logger.error(err_1);
                return [3 /*break*/, 6];
            case 6:
                messageData = {
                    id: msg.id.id,
                    ticketId: ticket.id,
                    contactId: msg.fromMe ? undefined : contact.id,
                    body: msg.body || media.filename,
                    fromMe: msg.fromMe,
                    read: msg.fromMe,
                    mediaUrl: media.filename,
                    mediaType: media.mimetype.split("/")[0],
                    quotedMsgId: quotedMsg === null || quotedMsg === void 0 ? void 0 : quotedMsg.id
                };
                return [4 /*yield*/, ticket.update({ lastMessage: msg.body || media.filename })];
            case 7:
                _a.sent();
                return [4 /*yield*/, CreateMessageService_1["default"]({ messageData: messageData })];
            case 8:
                newMessage = _a.sent();
                return [2 /*return*/, newMessage];
        }
    });
}); };
var verifyMessage = function (msg, ticket, contact) { return __awaiter(void 0, void 0, void 0, function () {
    var quotedMsg, messageData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (msg.type === 'location')
                    msg = prepareLocation(msg);
                return [4 /*yield*/, verifyQuotedMessage(msg)];
            case 1:
                quotedMsg = _a.sent();
                messageData = {
                    id: msg.id.id,
                    ticketId: ticket.id,
                    contactId: msg.fromMe ? undefined : contact.id,
                    body: msg.body,
                    fromMe: msg.fromMe,
                    mediaType: msg.type,
                    read: msg.fromMe,
                    quotedMsgId: quotedMsg === null || quotedMsg === void 0 ? void 0 : quotedMsg.id
                };
                // temporaryly disable ts checks because of type definition bug for Location object
                // @ts-ignore
                return [4 /*yield*/, ticket.update({ lastMessage: msg.type === "location" ? msg.location.description ? "Localization - " + msg.location.description.split('\\n')[0] : "Localization" : msg.body })];
            case 2:
                // temporaryly disable ts checks because of type definition bug for Location object
                // @ts-ignore
                _a.sent();
                return [4 /*yield*/, CreateMessageService_1["default"]({ messageData: messageData })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var prepareLocation = function (msg) {
    var gmapsUrl = "https://maps.google.com/maps?q=" + msg.location.latitude + "%2C" + msg.location.longitude + "&z=17&hl=pt-BR";
    msg.body = "data:image/png;base64," + msg.body + "|" + gmapsUrl;
    // temporaryly disable ts checks because of type definition bug for Location object
    // @ts-ignore
    msg.body += "|" + (msg.location.description ? msg.location.description : (msg.location.latitude + ", " + msg.location.longitude));
    return msg;
};
var verifyQueue = function (wbot, msg, ticket, contact) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, queues, greetingMessage, selectedOption, choosenQueue, body, sentMessage, options_1, body_1, debouncedSentMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ShowWhatsAppService_1["default"](wbot.id)];
            case 1:
                _a = _b.sent(), queues = _a.queues, greetingMessage = _a.greetingMessage;
                if (!(queues.length === 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, UpdateTicketService_1["default"]({
                        ticketData: { queueId: queues[0].id },
                        ticketId: ticket.id
                    })];
            case 2:
                _b.sent();
                return [2 /*return*/];
            case 3:
                selectedOption = msg.body;
                choosenQueue = queues[+selectedOption - 1];
                if (!choosenQueue) return [3 /*break*/, 7];
                return [4 /*yield*/, UpdateTicketService_1["default"]({
                        ticketData: { queueId: choosenQueue.id },
                        ticketId: ticket.id
                    })];
            case 4:
                _b.sent();
                body = Mustache_1["default"]("\u200E" + choosenQueue.greetingMessage, contact);
                return [4 /*yield*/, wbot.sendMessage(contact.number + "@c.us", body)];
            case 5:
                sentMessage = _b.sent();
                return [4 /*yield*/, verifyMessage(sentMessage, ticket, contact)];
            case 6:
                _b.sent();
                return [3 /*break*/, 8];
            case 7:
                options_1 = "";
                queues.forEach(function (queue, index) {
                    options_1 += "*" + (index + 1) + "* - " + queue.name + "\n";
                });
                body_1 = Mustache_1["default"]("\u200E" + greetingMessage + "\n" + options_1, contact);
                debouncedSentMessage = Debounce_1.debounce(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sentMessage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, wbot.sendMessage(contact.number + "@c.us", body_1)];
                            case 1:
                                sentMessage = _a.sent();
                                verifyMessage(sentMessage, ticket, contact);
                                return [2 /*return*/];
                        }
                    });
                }); }, 3000, ticket.id);
                debouncedSentMessage();
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
var isValidMsg = function (msg) {
    if (msg.from === "status@broadcast")
        return false;
    if (msg.type === "chat" ||
        msg.type === "audio" ||
        msg.type === "ptt" ||
        msg.type === "video" ||
        msg.type === "image" ||
        msg.type === "document" ||
        msg.type === "vcard" ||
        //msg.type === "multi_vcard" ||
        msg.type === "sticker" ||
        msg.type === "location")
        return true;
    return false;
};
var handleMessage = function (msg, wbot) { return __awaiter(void 0, void 0, void 0, function () {
    var msgContact, groupContact, chat, msgGroupContact, whatsapp, unreadMessages, contact, ticket, array, obj, contact_1, index, v, values, ind, obj_1, obj_1_1, ob, cont, e_1_1, error_1, err_2;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!isValidMsg(msg)) {
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 38, , 39]);
                msgContact = void 0;
                groupContact = void 0;
                if (!msg.fromMe) return [3 /*break*/, 3];
                // messages sent automatically by wbot have a special character in front of it
                // if so, this message was already been stored in database;
                if (/\u200e/.test(msg.body[0]))
                    return [2 /*return*/];
                // media messages sent from me from cell phone, first comes with "hasMedia = false" and type = "image/ptt/etc"
                // in this case, return and let this message be handled by "media_uploaded" event, when it will have "hasMedia = true"
                if (!msg.hasMedia && msg.type !== "location" && msg.type !== "chat" && msg.type !== "vcard"
                //&& msg.type !== "multi_vcard"
                )
                    return [2 /*return*/];
                return [4 /*yield*/, wbot.getContactById(msg.to)];
            case 2:
                msgContact = _b.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, msg.getContact()];
            case 4:
                msgContact = _b.sent();
                _b.label = 5;
            case 5: return [4 /*yield*/, msg.getChat()];
            case 6:
                chat = _b.sent();
                if (!chat.isGroup) return [3 /*break*/, 12];
                msgGroupContact = void 0;
                if (!msg.fromMe) return [3 /*break*/, 8];
                return [4 /*yield*/, wbot.getContactById(msg.to)];
            case 7:
                msgGroupContact = _b.sent();
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, wbot.getContactById(msg.from)];
            case 9:
                msgGroupContact = _b.sent();
                _b.label = 10;
            case 10: return [4 /*yield*/, verifyContact(msgGroupContact)];
            case 11:
                groupContact = _b.sent();
                _b.label = 12;
            case 12: return [4 /*yield*/, ShowWhatsAppService_1["default"](wbot.id)];
            case 13:
                whatsapp = _b.sent();
                unreadMessages = msg.fromMe ? 0 : chat.unreadCount;
                return [4 /*yield*/, verifyContact(msgContact)];
            case 14:
                contact = _b.sent();
                if (unreadMessages === 0 &&
                    whatsapp.farewellMessage &&
                    Mustache_1["default"](whatsapp.farewellMessage, contact) === msg.body)
                    return [2 /*return*/];
                return [4 /*yield*/, FindOrCreateTicketService_1["default"](contact, wbot.id, unreadMessages, groupContact)];
            case 15:
                ticket = _b.sent();
                if (!msg.hasMedia) return [3 /*break*/, 17];
                return [4 /*yield*/, verifyMediaMessage(msg, ticket, contact)];
            case 16:
                _b.sent();
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, verifyMessage(msg, ticket, contact)];
            case 18:
                _b.sent();
                _b.label = 19;
            case 19:
                if (!(!ticket.queue &&
                    !chat.isGroup &&
                    !msg.fromMe &&
                    !ticket.userId &&
                    whatsapp.queues.length >= 1)) return [3 /*break*/, 21];
                return [4 /*yield*/, verifyQueue(wbot, msg, ticket, contact)];
            case 20:
                _b.sent();
                _b.label = 21;
            case 21:
                if (!(msg.type === "vcard")) return [3 /*break*/, 37];
                _b.label = 22;
            case 22:
                _b.trys.push([22, 36, , 37]);
                array = msg.body.split("\n");
                obj = [];
                contact_1 = "";
                for (index = 0; index < array.length; index++) {
                    v = array[index];
                    values = v.split(":");
                    for (ind = 0; ind < values.length; ind++) {
                        if (values[ind].indexOf("+") !== -1) {
                            obj.push({ number: values[ind] });
                        }
                        if (values[ind].indexOf("FN") !== -1) {
                            contact_1 = values[ind + 1];
                        }
                    }
                }
                _b.label = 23;
            case 23:
                _b.trys.push([23, 29, 30, 35]);
                obj_1 = __asyncValues(obj);
                _b.label = 24;
            case 24: return [4 /*yield*/, obj_1.next()];
            case 25:
                if (!(obj_1_1 = _b.sent(), !obj_1_1.done)) return [3 /*break*/, 28];
                ob = obj_1_1.value;
                return [4 /*yield*/, CreateContactService_1["default"]({
                        name: contact_1,
                        number: ob.number.replace(/\D/g, "")
                    })];
            case 26:
                cont = _b.sent();
                _b.label = 27;
            case 27: return [3 /*break*/, 24];
            case 28: return [3 /*break*/, 35];
            case 29:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 35];
            case 30:
                _b.trys.push([30, , 33, 34]);
                if (!(obj_1_1 && !obj_1_1.done && (_a = obj_1["return"]))) return [3 /*break*/, 32];
                return [4 /*yield*/, _a.call(obj_1)];
            case 31:
                _b.sent();
                _b.label = 32;
            case 32: return [3 /*break*/, 34];
            case 33:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 34: return [7 /*endfinally*/];
            case 35: return [3 /*break*/, 37];
            case 36:
                error_1 = _b.sent();
                console.log(error_1);
                return [3 /*break*/, 37];
            case 37: return [3 /*break*/, 39];
            case 38:
                err_2 = _b.sent();
                Sentry.captureException(err_2);
                logger_1.logger.error("Error handling whatsapp message: Err: " + err_2);
                return [3 /*break*/, 39];
            case 39: return [2 /*return*/];
        }
    });
}); };
exports.handleMessage = handleMessage;
var handleMsgAck = function (msg, ack) { return __awaiter(void 0, void 0, void 0, function () {
    var io, messageToUpdate, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
            case 1:
                _a.sent();
                io = socket_1.getIO();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                return [4 /*yield*/, Message_1["default"].findByPk(msg.id.id, {
                        include: [
                            "contact",
                            {
                                model: Message_1["default"],
                                as: "quotedMsg",
                                include: ["contact"]
                            }
                        ]
                    })];
            case 3:
                messageToUpdate = _a.sent();
                if (!messageToUpdate) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, messageToUpdate.update({ ack: ack })];
            case 4:
                _a.sent();
                io.to(messageToUpdate.ticketId.toString()).emit("appMessage", {
                    action: "update",
                    message: messageToUpdate
                });
                return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                Sentry.captureException(err_3);
                logger_1.logger.error("Error handling message ack. Err: " + err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var wbotMessageListener = function (wbot) {
    wbot.on("message_create", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            handleMessage(msg, wbot);
            return [2 /*return*/];
        });
    }); });
    wbot.on("media_uploaded", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            handleMessage(msg, wbot);
            return [2 /*return*/];
        });
    }); });
    wbot.on("message_ack", function (msg, ack) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            handleMsgAck(msg, ack);
            return [2 /*return*/];
        });
    }); });
};
exports.wbotMessageListener = wbotMessageListener;
