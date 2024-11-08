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
exports.removeWbot = exports.getWbot = exports.initWbot = void 0;
var qrcode_terminal_1 = require("qrcode-terminal");
var whatsapp_web_js_1 = require("whatsapp-web.js");
var socket_1 = require("./socket");
var AppError_1 = require("../errors/AppError");
var logger_1 = require("../utils/logger");
var wbotMessageListener_1 = require("../services/WbotServices/wbotMessageListener");
var sessions = [];
var syncUnreadMessages = function (wbot) { return __awaiter(void 0, void 0, void 0, function () {
    var chats, _i, chats_1, chat, unreadMessages, _a, unreadMessages_1, msg;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, wbot.getChats()];
            case 1:
                chats = _b.sent();
                _i = 0, chats_1 = chats;
                _b.label = 2;
            case 2:
                if (!(_i < chats_1.length)) return [3 /*break*/, 10];
                chat = chats_1[_i];
                if (!(chat.unreadCount > 0)) return [3 /*break*/, 9];
                return [4 /*yield*/, chat.fetchMessages({
                        limit: chat.unreadCount
                    })];
            case 3:
                unreadMessages = _b.sent();
                _a = 0, unreadMessages_1 = unreadMessages;
                _b.label = 4;
            case 4:
                if (!(_a < unreadMessages_1.length)) return [3 /*break*/, 7];
                msg = unreadMessages_1[_a];
                return [4 /*yield*/, wbotMessageListener_1.handleMessage(msg, wbot)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _a++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, chat.sendSeen()];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 2];
            case 10: return [2 /*return*/];
        }
    });
}); };
var initWbot = function (whatsapp) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                try {
                    var io_1 = socket_1.getIO();
                    var sessionName_1 = whatsapp.name;
                    var sessionCfg = void 0;
                    if (whatsapp && whatsapp.session) {
                        sessionCfg = JSON.parse(whatsapp.session);
                    }
                    var args = process.env.CHROME_ARGS || "";
                    var wbot_1 = new whatsapp_web_js_1.Client({
                        session: sessionCfg,
                        authStrategy: new whatsapp_web_js_1.LocalAuth({ clientId: 'bd_' + whatsapp.id }),
                        puppeteer: {
                            executablePath: process.env.CHROME_BIN || undefined,
                            // @ts-ignore
                            browserWSEndpoint: process.env.CHROME_WS || undefined,
                            args: args.split(' ')
                        }
                    });
                    wbot_1.initialize();
                    wbot_1.on("qr", function (qr) { return __awaiter(void 0, void 0, void 0, function () {
                        var sessionIndex;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger_1.logger.info("Session:", sessionName_1);
                                    qrcode_terminal_1["default"].generate(qr, { small: true });
                                    return [4 /*yield*/, whatsapp.update({ qrcode: qr, status: "qrcode", retries: 0 })];
                                case 1:
                                    _a.sent();
                                    sessionIndex = sessions.findIndex(function (s) { return s.id === whatsapp.id; });
                                    if (sessionIndex === -1) {
                                        wbot_1.id = whatsapp.id;
                                        sessions.push(wbot_1);
                                    }
                                    io_1.emit("whatsappSession", {
                                        action: "update",
                                        session: whatsapp
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    wbot_1.on("authenticated", function (session) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            logger_1.logger.info("Session: " + sessionName_1 + " AUTHENTICATED");
                            return [2 /*return*/];
                        });
                    }); });
                    wbot_1.on("auth_failure", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                        var retry;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.error("Session: " + sessionName_1 + " AUTHENTICATION FAILURE! Reason: " + msg);
                                    if (!(whatsapp.retries > 1)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, whatsapp.update({ session: "", retries: 0 })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    retry = whatsapp.retries;
                                    return [4 /*yield*/, whatsapp.update({
                                            status: "DISCONNECTED",
                                            retries: retry + 1
                                        })];
                                case 3:
                                    _a.sent();
                                    io_1.emit("whatsappSession", {
                                        action: "update",
                                        session: whatsapp
                                    });
                                    reject(new Error("Error starting whatsapp session."));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    wbot_1.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var sessionIndex;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger_1.logger.info("Session: " + sessionName_1 + " READY");
                                    return [4 /*yield*/, whatsapp.update({
                                            status: "CONNECTED",
                                            qrcode: "",
                                            retries: 0
                                        })];
                                case 1:
                                    _a.sent();
                                    io_1.emit("whatsappSession", {
                                        action: "update",
                                        session: whatsapp
                                    });
                                    sessionIndex = sessions.findIndex(function (s) { return s.id === whatsapp.id; });
                                    if (sessionIndex === -1) {
                                        wbot_1.id = whatsapp.id;
                                        sessions.push(wbot_1);
                                    }
                                    wbot_1.sendPresenceAvailable();
                                    return [4 /*yield*/, syncUnreadMessages(wbot_1)];
                                case 2:
                                    _a.sent();
                                    resolve(wbot_1);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (err) {
                    logger_1.logger.error(err);
                }
            })];
    });
}); };
exports.initWbot = initWbot;
var getWbot = function (whatsappId) {
    var sessionIndex = sessions.findIndex(function (s) { return s.id === whatsappId; });
    if (sessionIndex === -1) {
        throw new AppError_1["default"]("ERR_WAPP_NOT_INITIALIZED");
    }
    return sessions[sessionIndex];
};
exports.getWbot = getWbot;
var removeWbot = function (whatsappId) {
    try {
        var sessionIndex = sessions.findIndex(function (s) { return s.id === whatsappId; });
        if (sessionIndex !== -1) {
            sessions[sessionIndex].destroy();
            sessions.splice(sessionIndex, 1);
        }
    }
    catch (err) {
        logger_1.logger.error(err);
    }
};
exports.removeWbot = removeWbot;
