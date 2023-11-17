"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.deleteEventByName = exports.deleteEvent = exports.updateEventByName = exports.updateEvent = exports.getEventByTitle = exports.getEventVolunteersByOrganizer = exports.getEventTicketsByOrganizer = exports.getEventByOrganizer = exports.getTopEventsByOrganizer = exports.getRecentEventByTopOrganizer = exports.getEventsByOrganizer = exports.getInvitesByEvent = exports.getAllInvites = exports.getEvents = exports.getEventByName = exports.getEvent = exports.createEvent = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const eventService = __importStar(require("./event.service"));
const inviteService = __importStar(require("../invites/invite.service"));
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../../config/config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloudName,
    api_key: config_1.default.cloudinary.apiKey,
    api_secret: config_1.default.cloudinary.apiSecret,
});
exports.createEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const photoUrl = yield cloudinary_1.v2.uploader.upload(req.body.image);
    const event = yield eventService.createEvent(Object.assign(Object.assign({}, req.body), { image: photoUrl.url }));
    res.status(http_status_1.default.CREATED).send(event);
}));
exports.getEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['eventId'] === 'string') {
        const event = yield eventService.getEventById(new mongoose_1.default.Types.ObjectId(req.params['eventId']));
        if (!event) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Event not found');
        }
        res.send(event);
    }
}));
exports.getEventByName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['eventName'] === 'string') {
        const event = yield eventService.getEventByTitle(req.params['eventName']);
        if (!event) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Event not found');
        }
        res.send(event);
    }
}));
exports.getEvents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield eventService.getEvents();
    res.status(http_status_1.default.OK).send(events);
}));
exports.getAllInvites = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield inviteService.getAllInvites();
    res.status(http_status_1.default.OK).send(invites);
}));
exports.getInvitesByEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield inviteService.getInvitesByEvent(req.body.eventId);
    res.status(http_status_1.default.OK).send(invites);
}));
exports.getEventsByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['organizer'] === 'string') {
        const event = yield eventService.getEventsByOrganizer(new mongoose_1.default.Types.ObjectId(req.params['organizer']));
        if (!event) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No events found');
        }
        res.send(event);
    }
}));
exports.getRecentEventByTopOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield eventService.getRecentEventByTopOrganizer();
    res.status(http_status_1.default.OK).send(event);
}));
exports.getTopEventsByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['organizer'] === 'string') {
        const event = yield eventService.getTopEventsByOrganizer(new mongoose_1.default.Types.ObjectId(req.params['organizer']));
        if (!event) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No events found');
        }
        res.send(event);
    }
}));
exports.getEventByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['title'] === 'string') {
        const event = yield eventService.getEventByOrganizer(req.params['title'], req.params['organizer']);
        if (!event) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Event not found');
        }
        res.send(event);
    }
}));
exports.getEventTicketsByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['title'] === 'string') {
        const tickets = yield eventService.getEventTicketsByOrganizer(req.params['title'], req.params['organizer']);
        if (!tickets) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Tickets not found');
        }
        res.send(tickets);
    }
}));
exports.getEventVolunteersByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['title'] === 'string') {
        const volunteers = yield eventService.getEventVolunteersByOrganizer(req.params['title'], req.params['organizer']);
        if (!volunteers) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Volunteers not found');
        }
        res.send(volunteers);
    }
}));
exports.getEventByTitle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['title'] === 'string') {
        const event = yield eventService.getEvent(req.params['title']);
        if (!event) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Event not found');
        }
        res.send(event);
    }
}));
exports.updateEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['eventId'] === 'string') {
        const event = yield eventService.updateEventById(new mongoose_1.default.Types.ObjectId(req.params['eventId']), req.body);
        res.send(event);
    }
}));
exports.updateEventByName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['eventName'] === 'string') {
        const event = yield eventService.updateEventByName(req.params['eventName'], req.body);
        res.send(event);
    }
}));
exports.deleteEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['eventId'] === 'string') {
        yield eventService.deleteEventById(new mongoose_1.default.Types.ObjectId(req.params['eventId']));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
exports.deleteEventByName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['eventName'] === 'string') {
        yield eventService.deleteEventByName(req.params['eventName']);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
