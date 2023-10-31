"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.updateTicket = exports.getTicketsByPrice = exports.getTicketsByUser = exports.getRevenueByOrganizer = exports.getTicketsByOrganizer = exports.getTicket = exports.getTicketByTransactionId = exports.getTicketsByCategory = exports.getTickets = exports.createTicket = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const createTicketBody = {
    email: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
    ticketId: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    event: joi_1.default.string().required(),
    isCheckedIn: joi_1.default.boolean().required(),
    user: joi_1.default.any(),
    noOfCheckedIn: joi_1.default.number(),
};
exports.createTicket = {
    body: joi_1.default.object().keys(createTicketBody),
};
exports.getTickets = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        ticektBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getTicketsByCategory = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.getTicketByTransactionId = {
    params: joi_1.default.object().keys({
        transactionId: joi_1.default.string(),
    }),
};
exports.getTicket = {
    params: joi_1.default.object().keys({
        ticektId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.getTicketsByOrganizer = {
    params: joi_1.default.object().keys({
        organizer: joi_1.default.string(),
    }),
};
exports.getRevenueByOrganizer = {
    params: joi_1.default.object().keys({
        organizer: joi_1.default.string(),
    }),
};
exports.getTicketsByUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.getTicketsByPrice = {
    params: joi_1.default.object().keys({
        ticektOrganizer: joi_1.default.string(),
    }),
};
exports.updateTicket = {
    params: joi_1.default.object().keys({
        ticektId: joi_1.default.required().custom(custom_validation_1.objectId),
    })
};
exports.deleteTicket = {
    params: joi_1.default.object().keys({
        ticektId: joi_1.default.string().custom(custom_validation_1.objectId)
    }),
};
