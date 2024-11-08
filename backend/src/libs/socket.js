"use strict";
exports.__esModule = true;
exports.getIO = exports.initIO = void 0;
var socket_io_1 = require("socket.io");
var jsonwebtoken_1 = require("jsonwebtoken");
var AppError_1 = require("../errors/AppError");
var logger_1 = require("../utils/logger");
var auth_1 = require("../config/auth");
var io;
var initIO = function (httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL
        }
    });
    io.on("connection", function (socket) {
        var token = socket.handshake.query.token;
        var tokenData = null;
        try {
            tokenData = jsonwebtoken_1.verify(token, auth_1["default"].secret);
            logger_1.logger.debug(JSON.stringify(tokenData), "io-onConnection: tokenData");
        }
        catch (error) {
            logger_1.logger.error(JSON.stringify(error), "Error decoding token");
            socket.disconnect();
            return io;
        }
        logger_1.logger.info("Client Connected");
        socket.on("joinChatBox", function (ticketId) {
            logger_1.logger.info("A client joined a ticket channel");
            socket.join(ticketId);
        });
        socket.on("joinNotification", function () {
            logger_1.logger.info("A client joined notification channel");
            socket.join("notification");
        });
        socket.on("joinTickets", function (status) {
            logger_1.logger.info("A client joined to " + status + " tickets channel.");
            socket.join(status);
        });
        socket.on("disconnect", function () {
            logger_1.logger.info("Client disconnected");
        });
        return socket;
    });
    return io;
};
exports.initIO = initIO;
var getIO = function () {
    if (!io) {
        throw new AppError_1["default"]("Socket IO not initialized");
    }
    return io;
};
exports.getIO = getIO;
