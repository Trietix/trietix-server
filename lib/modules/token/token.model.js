"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const token_types_1 = __importDefault(require("./token.types"));
let Token = class Token {
    constructor() {
        this.token = '';
        this.user = '';
        this.type = '';
        this.expires = null;
        this.blacklisted = false;
    }
};
exports.Token = Token;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Token.prototype, "token", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Token.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, enum: [token_types_1.default.REFRESH, token_types_1.default.RESET_PASSWORD, token_types_1.default.VERIFY_EMAIL] }),
    __metadata("design:type", String)
], Token.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Date)
], Token.prototype, "expires", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Token.prototype, "blacklisted", void 0);
exports.Token = Token = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    }),
    (0, typegoose_1.index)({ user: 1 })
], Token);
;
const TokenModel = (0, typegoose_1.getModelForClass)(Token);
exports.default = TokenModel;
