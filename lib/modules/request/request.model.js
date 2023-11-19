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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let Request = class Request {
    constructor() {
        this.reason = '';
        this.associationName = '';
        this.universityName = '';
        this.nin = '';
        this.driverLicense = '';
        this.presidentId = '';
        this.organizerId = '';
        this.type = 'university';
        this.status = 'pending';
    }
};
exports.Request = Request;
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], Request.prototype, "reason", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], Request.prototype, "associationName", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], Request.prototype, "universityName", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], Request.prototype, "nin", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], Request.prototype, "driverLicense", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], Request.prototype, "presidentId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Request.prototype, "organizerId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, enum: ['university', 'corporate'] }),
    __metadata("design:type", String)
], Request.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, enum: ['accepted', 'declined', 'pending'] }),
    __metadata("design:type", String)
], Request.prototype, "status", void 0);
exports.Request = Request = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true
        }
    })
], Request);
;
const RequestModel = (0, typegoose_1.getModelForClass)(Request);
exports.default = RequestModel;
