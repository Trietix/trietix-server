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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const roles_1 = require("../../config/roles");
let User = class User {
    constructor() {
        this.username = '';
        this.name = '';
        this.email = '';
        this.password = '';
        this.tickets = [];
        this.events = [];
        this.phoneNumber = '';
        this.eventsAttended = [];
        this.eventsPaid = [''];
        this.invitations = [''];
        this.photo = '';
        this.role = '';
        this.volunteer = '';
        this.accountName = '';
        this.accountNumber = 0;
        this.bank = '';
        this.isVerified = false;
    }
    /**
    * Check if password matches the user's password
    * @param {string} password
    * @returns {Promise<boolean>}
    */
    isPasswordMatch(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.compare(password, this.password);
        });
    }
};
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, trim: true, lowercase: true, type: String, validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Invalid email');
            }
        } }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true, minlength: 8, validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        }, private: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], User.prototype, "tickets", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], User.prototype, "events", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], User.prototype, "eventsAttended", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], User.prototype, "eventsPaid", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], User.prototype, "invitations", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "photo", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 'user', enum: roles_1.roles }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "volunteer", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "accountName", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], User.prototype, "accountNumber", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "bank", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
exports.User = User = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true
        }
    }),
    (0, typegoose_1.index)({ email: 1 }),
    (0, typegoose_1.pre)('save', function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isModified('password')) {
                this.password = yield bcryptjs_1.default.hash(this.password, 8);
            }
            next();
        });
    })
], User);
;
const userModel = (0, typegoose_1.getModelForClass)(User);
exports.default = userModel;
