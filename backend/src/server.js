"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_graceful_shutdown_1 = require("http-graceful-shutdown");
var socket_1 = require("./libs/socket"); // ou qualquer funcionalidade de socket que você tenha
var logger_1 = require("./utils/logger"); // ou qualquer função de log que você tenha
var StartAllWhatsAppsSessions_1 = require("./services/WbotServices/StartAllWhatsAppsSessions"); // ou qualquer função de inicialização
// Inicialize o Express
var app = express_1["default"]();
// Middleware para garantir que a requisição seja tratada como JSON (se necessário para algum endpoint posterior)
app.use(express_1["default"].json());
// Iniciar o servidor
var server = app.listen(process.env.PORT || 3000, function () {
    logger_1.logger.info("Server started on port: " + (process.env.PORT || 3000));
});
// Iniciar qualquer funcionalidade extra (WebSockets, etc.)
socket_1.initIO(server);
StartAllWhatsAppsSessions_1.StartAllWhatsAppsSessions();
// Implementar shutdown gracioso
http_graceful_shutdown_1["default"](server);
