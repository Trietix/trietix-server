"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventByName = exports.deleteEvent = exports.updateEventByName = exports.updateEvent = exports.getTopEventsByOrganizer = exports.getRecentEventsByOrganizer = exports.getEventsByOrganizer = exports.getEventsByPrice = exports.getEventVolunteers = exports.getEventTickets = exports.getEventByTitle = exports.getEvent = exports.getEventsByCategory = exports.getRecentEvents = exports.getTopEvents = exports.getEvents = exports.createEvent = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const createEventBody = {
    title: joi_1.default.string(),
    location: joi_1.default.string(),
    color: joi_1.default.string(),
    description: joi_1.default.string(),
    venue: joi_1.default.string(),
    time: joi_1.default.string(),
    price: joi_1.default.number(),
    invites: joi_1.default.array(),
    date: joi_1.default.string(),
    processingFee: joi_1.default.number(),
    tickets: joi_1.default.array(),
    organizer: joi_1.default.string(),
    image: joi_1.default.string(),
    socials: joi_1.default.array(),
    checkedIn: joi_1.default.array(),
    category: joi_1.default.array(),
};
exports.createEvent = {
    body: joi_1.default.object().keys(createEventBody),
};
exports.getEvents = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        eventBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getTopEvents = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        eventBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getRecentEvents = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        eventBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getEventsByCategory = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.getEvent = {
    params: joi_1.default.object().keys({
        eventId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.getEventByTitle = {
    params: joi_1.default.object().keys({
        title: joi_1.default.string()
    })
};
exports.getEventTickets = {
    params: joi_1.default.object().keys({
        title: joi_1.default.string()
    })
};
exports.getEventVolunteers = {
    params: joi_1.default.object().keys({
        title: joi_1.default.string()
    })
};
exports.getEventsByPrice = {
    params: joi_1.default.object().keys({
        eventPrice: joi_1.default.string()
    })
};
exports.getEventsByOrganizer = {
    params: joi_1.default.object().keys({
        organizer: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.getRecentEventsByOrganizer = {
    params: joi_1.default.object().keys({
        eventOrganizer: joi_1.default.string(),
    }),
};
exports.getTopEventsByOrganizer = {
    params: joi_1.default.object().keys({
        organizer: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.updateEvent = {
    params: joi_1.default.object().keys({
        eventId: joi_1.default.required().custom(custom_validation_1.objectId),
    })
};
exports.updateEventByName = {
    params: joi_1.default.object().keys({
        eventName: joi_1.default.string().required(),
    })
};
exports.deleteEvent = {
    params: joi_1.default.object().keys({
        eventId: joi_1.default.string().custom(custom_validation_1.objectId)
    }),
};
exports.deleteEventByName = {
    params: joi_1.default.object().keys({
        eventName: joi_1.default.string()
    })
};
