"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayout = exports.updatePayout = exports.getPayout = exports.getPayoutsByEvent = exports.getPayoutsByOrganizer = exports.getPayouts = exports.createPayout = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const createPayoutBody = {
    organizerId: joi_1.default.string(),
    eventId: joi_1.default.string(),
    status: joi_1.default.string().required().valid('Not paid', 'Paid', 'declined'),
};
exports.createPayout = {
    body: joi_1.default.object().keys(createPayoutBody),
};
exports.getPayouts = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        PayoutBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getPayoutsByOrganizer = {
    params: joi_1.default.object().keys({
        organizerId: joi_1.default.string(),
    }),
};
exports.getPayoutsByEvent = {
    params: joi_1.default.object().keys({
        eventId: joi_1.default.string(),
    }),
};
exports.getPayout = {
    params: joi_1.default.object().keys({
        payoutId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.updatePayout = {
    params: joi_1.default.object().keys({
        payoutId: joi_1.default.required().custom(custom_validation_1.objectId),
    })
};
exports.deletePayout = {
    params: joi_1.default.object().keys({
        payoutId: joi_1.default.string().custom(custom_validation_1.objectId)
    }),
};
