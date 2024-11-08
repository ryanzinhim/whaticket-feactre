"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var sequelize_typescript_1 = require("sequelize-typescript");
var Contact_1 = require("./Contact");
var Ticket_1 = require("./Ticket");
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    function Message() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Message_1 = Message;
    Object.defineProperty(Message.prototype, "mediaUrl", {
        get: function () {
            if (this.getDataValue("mediaUrl")) {
                return process.env.BACKEND_URL + ":" + process.env.PROXY_PORT + "/public/" + this.getDataValue("mediaUrl");
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    var Message_1;
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.Column
    ], Message.prototype, "id");
    __decorate([
        sequelize_typescript_1.Default(0),
        sequelize_typescript_1.Column
    ], Message.prototype, "ack");
    __decorate([
        sequelize_typescript_1.Default(false),
        sequelize_typescript_1.Column
    ], Message.prototype, "read");
    __decorate([
        sequelize_typescript_1.Default(false),
        sequelize_typescript_1.Column
    ], Message.prototype, "fromMe");
    __decorate([
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
    ], Message.prototype, "body");
    __decorate([
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING)
    ], Message.prototype, "mediaUrl");
    __decorate([
        sequelize_typescript_1.Column
    ], Message.prototype, "mediaType");
    __decorate([
        sequelize_typescript_1.Default(false),
        sequelize_typescript_1.Column
    ], Message.prototype, "isDeleted");
    __decorate([
        sequelize_typescript_1.CreatedAt,
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.DATE(6))
    ], Message.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt,
        sequelize_typescript_1.Column(sequelize_typescript_1.DataType.DATE(6))
    ], Message.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return Message_1; }),
        sequelize_typescript_1.Column
    ], Message.prototype, "quotedMsgId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return Message_1; }, "quotedMsgId")
    ], Message.prototype, "quotedMsg");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return Ticket_1["default"]; }),
        sequelize_typescript_1.Column
    ], Message.prototype, "ticketId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return Ticket_1["default"]; })
    ], Message.prototype, "ticket");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return Contact_1["default"]; }),
        sequelize_typescript_1.Column
    ], Message.prototype, "contactId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return Contact_1["default"]; }, "contactId")
    ], Message.prototype, "contact");
    Message = Message_1 = __decorate([
        sequelize_typescript_1.Table
    ], Message);
    return Message;
}(sequelize_typescript_1.Model));
exports["default"] = Message;
