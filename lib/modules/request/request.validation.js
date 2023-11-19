"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.updateRequest = exports.declineRequest = exports.acceptRequest = exports.getRequest = exports.getRequestsByOrganizer = exports.getAllRequests = exports.createRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const createRequestBody = {
    organizerId: joi_1.default.string().required(),
    reason: joi_1.default.string(),
    nin: joi_1.default.string(),
    associationName: joi_1.default.string(),
    universityName: joi_1.default.string(),
    type: joi_1.default.string().required().valid('university', 'corporate'),
    presidentId: joi_1.default.string(),
    driverLicense: joi_1.default.string(),
    status: joi_1.default.string().required().valid('pending', 'declined', 'accepted'),
};
exports.createRequest = {
    body: joi_1.default.object().keys(createRequestBody),
};
exports.getAllRequests = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        RequestBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getRequestsByOrganizer = {
    params: joi_1.default.object().keys({
        organizerId: joi_1.default.string(),
    }),
};
exports.getRequest = {
    params: joi_1.default.object().keys({
        RequestId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.acceptRequest = {
    params: joi_1.default.object().keys({
        RequestId: joi_1.default.required().custom(custom_validation_1.objectId),
    })
};
exports.declineRequest = {
    params: joi_1.default.object().keys({
        RequestId: joi_1.default.required().custom(custom_validation_1.objectId),
    })
};
exports.updateRequest = {
    params: joi_1.default.object().keys({
        RequestId: joi_1.default.required().custom(custom_validation_1.objectId),
    })
};
exports.deleteRequest = {
    params: joi_1.default.object().keys({
        RequestId: joi_1.default.string().custom(custom_validation_1.objectId)
    }),
};
