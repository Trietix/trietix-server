"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvite = exports.updateInvite = exports.getInvite = exports.getInvitesByEvent = exports.getInvitesByUser = exports.getInvites = exports.createInvite = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const createInviteBody = {
    email: joi_1.default.string(),
    eventId: joi_1.default.string(),
    status: joi_1.default.string().required().valid('pending', 'accepted', 'declined'),
};
exports.createInvite = {
    body: joi_1.default.object().keys(createInviteBody),
};
exports.getInvites = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        inviteBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getInvitesByUser = {
    params: joi_1.default.object().keys({
        email: joi_1.default.string(),
    }),
};
exports.getInvitesByEvent = {
    params: joi_1.default.object().keys({
        eventId: joi_1.default.string(),
    }),
};
exports.getInvite = {
    params: joi_1.default.object().keys({
        inviteId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.updateInvite = {
    params: joi_1.default.object().keys({
        inviteId: joi_1.default.required().custom(custom_validation_1.objectId),
    })
};
exports.deleteInvite = {
    params: joi_1.default.object().keys({
        inviteId: joi_1.default.string().custom(custom_validation_1.objectId)
    }),
};
