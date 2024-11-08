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
var ContactCustomField = /** @class */ (function (_super) {
    __extends(ContactCustomField, _super);
    function ContactCustomField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], ContactCustomField.prototype, "id");
    __decorate([
        sequelize_typescript_1.Column
    ], ContactCustomField.prototype, "name");
    __decorate([
        sequelize_typescript_1.Column
    ], ContactCustomField.prototype, "value");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return Contact_1["default"]; }),
        sequelize_typescript_1.Column
    ], ContactCustomField.prototype, "contactId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return Contact_1["default"]; })
    ], ContactCustomField.prototype, "contact");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], ContactCustomField.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], ContactCustomField.prototype, "updatedAt");
    ContactCustomField = __decorate([
        sequelize_typescript_1.Table
    ], ContactCustomField);
    return ContactCustomField;
}(sequelize_typescript_1.Model));
exports["default"] = ContactCustomField;
