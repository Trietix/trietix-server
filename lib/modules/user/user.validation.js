"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getTopOrganizers = exports.getOrganizers = exports.getUsers = exports.createUser = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const createUserBody = {
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().required().custom(custom_validation_1.password),
    username: joi_1.default.string(),
    name: joi_1.default.string().required(),
    photo: joi_1.default.string(),
    role: joi_1.default.string().required().valid('user', 'admin', 'organizer'),
    tickets: joi_1.default.any(),
    invitations: joi_1.default.array(),
    events: joi_1.default.any(),
    eventsAttended: joi_1.default.string(),
    eventsPaid: joi_1.default.string(),
    volunteer: joi_1.default.string(),
    isVerified: joi_1.default.boolean(),
    phoneNumber: joi_1.default.string(),
    accountNumber: joi_1.default.number(),
    accountName: joi_1.default.string(),
    bank: joi_1.default.string()
};
exports.createUser = {
    body: joi_1.default.object().keys(createUserBody),
};
exports.getUsers = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        projectBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getOrganizers = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        projectBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getTopOrganizers = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        projectBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.updateUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        password: joi_1.default.string().required().custom(custom_validation_1.password),
        username: joi_1.default.string(),
        name: joi_1.default.string().required(),
        email: joi_1.default.string().required().email(),
        photo: joi_1.default.string(),
    })
        .min(1),
};
exports.deleteUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
