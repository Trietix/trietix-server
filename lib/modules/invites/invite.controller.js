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
exports.deleteInvite = exports.updateInvite = exports.getInvite = exports.getInvitesByEvent = exports.getInvitesByUser = exports.getAllInvites = exports.createInvite = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const sendMail_1 = require("../utils/sendMail");
const inviteService = __importStar(require("./invite.service"));
const event_1 = require("../event");
const user_1 = require("../user");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createInvite = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invite = yield inviteService.createInvite(req.body);
    const event = yield event_1.eventService.getEventById(req.body.eventId);
    const user = yield user_1.userService.getUserById(event === null || event === void 0 ? void 0 : event.organizer);
    (0, sendMail_1.sendMail)(req.body.email, "You've been invited as a volunteer - Trietix", { oraganizer: user === null || user === void 0 ? void 0 : user.name, eventTitle: event === null || event === void 0 ? void 0 : event.title, eventVenue: event === null || event === void 0 ? void 0 : event.venue, eventDate: event === null || event === void 0 ? void 0 : event.date, eventLocation: event === null || event === void 0 ? void 0 : event.location, eventTime: event === null || event === void 0 ? void 0 : event.time, url: `https://trietix.vercel.app/invites/${invite === null || invite === void 0 ? void 0 : invite.id}` }, "user/invite.hbs");
    res.status(http_status_1.default.CREATED).send(invite);
}));
exports.getAllInvites = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invite = yield inviteService.getAllInvites();
    if (!invite) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Invites not found');
    }
    res.send(invite);
}));
exports.getInvitesByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield inviteService.getAllInvitesByUser(req.params['email']);
    if (!invites) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Invites not found');
    }
    res.send(invites);
}));
exports.getInvitesByEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield inviteService.getInvitesByEvent(req.params['eventId']);
    if (!invites) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Invites not found');
    }
    res.send(invites);
}));
exports.getInvite = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['inviteId'] === 'string') {
        const invite = yield inviteService.getInviteById(new mongoose_1.default.Types.ObjectId(req.params['inviteId']));
        if (!invite) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Event not found');
        }
        res.send(invite);
    }
}));
exports.updateInvite = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['inviteId'] === 'string') {
        const invite = yield inviteService.updateInviteById(new mongoose_1.default.Types.ObjectId(req.params['inviteId']), req.body);
        res.send(invite);
    }
}));
exports.deleteInvite = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['inviteId'] === 'string') {
        yield inviteService.deleteInviteById(new mongoose_1.default.Types.ObjectId(req.params['inviteId']));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
