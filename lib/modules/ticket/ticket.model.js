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
exports.Ticket = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let Ticket = class Ticket {
    constructor() {
        this.email = '';
        this.amount = 0;
        this.ticketId = '';
        this.price = 0;
        this.event = '';
        this.noOfCheckedIn = 0;
        this.isCheckedIn = false;
        this.user = '';
    }
};
exports.Ticket = Ticket;
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Ticket.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "amount", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Ticket.prototype, "ticketId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Ticket.prototype, "event", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "noOfCheckedIn", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", Boolean)
], Ticket.prototype, "isCheckedIn", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Ticket.prototype, "user", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true
        }
    }),
    (0, typegoose_1.index)({ email: 1 })
], Ticket);
;
const ticketModel = (0, typegoose_1.getModelForClass)(Ticket);
exports.default = ticketModel;
