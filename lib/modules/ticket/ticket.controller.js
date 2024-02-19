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
exports.deleteTicket = exports.updateTicket = exports.getTicketsByEvent = exports.getTicketsByPrice = exports.getTicketByTransactionId = exports.getTicketsByUser = exports.getRevenueByOrganizer = exports.getTicketsByOrganizer = exports.getTickets = exports.getTicket = exports.createTicket = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const ticketService = __importStar(require("./ticket.service"));
const sendMail_1 = require("../utils/sendMail");
exports.createTicket = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield ticketService.createTicket(req.body);
    (0, sendMail_1.sendMail)(req.body.email, `Ticket purchase successful [${req.body.ticketId}] - Trietix`, { amount: req.body.amount, url: `https://trietix.com/ticket/${req.body.ticketId}` }, "user/ticket.hbs");
    res.status(http_status_1.default.CREATED).send(ticket);
}));
exports.getTicket = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['ticketId'] === 'string') {
        const ticket = yield ticketService.getTicketById(new mongoose_1.default.Types.ObjectId(req.params['ticketId']));
        if (!ticket) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Ticket not found');
        }
        res.send(ticket);
    }
}));
exports.getTickets = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticketService.getTickets();
    res.status(http_status_1.default.OK).send(tickets);
}));
exports.getTicketsByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['organizer'] === 'string') {
        const ticket = yield ticketService.getTicketsByOrganizer(new mongoose_1.default.Types.ObjectId(req.params['organizer']));
        if (!ticket) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No tickets found');
        }
        res.send(ticket);
    }
}));
exports.getRevenueByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['organizer'] === 'string') {
        const revenue = yield ticketService.getRevenueByOrganizer(new mongoose_1.default.Types.ObjectId(req.params['organizer']));
        if (!revenue) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No revenue');
        }
        ;
        console.log(revenue);
        res.send(revenue);
    }
}));
exports.getTicketsByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['userId'] === 'string') {
        const ticket = yield ticketService.getTicketsByUser(new mongoose_1.default.Types.ObjectId(req.params['userId']));
        if (!ticket) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No tickets found');
        }
        res.send(ticket);
    }
}));
exports.getTicketByTransactionId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['transactionId'] === 'string') {
        const ticket = yield ticketService.getTicketByTransactionId((req.params['transactionId']));
        if (!ticket) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No ticket found');
        }
        res.send(ticket);
    }
}));
exports.getTicketsByPrice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticketService.getTicketsByPrice(parseInt(req.params['ticketPrice']));
    if (!tickets) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Tickets not found');
    }
    res.send(tickets);
}));
exports.getTicketsByEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticketService.getTicketsByEvent(req.params['eventId']);
    if (!tickets) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Tickets not found');
    }
    res.send(tickets);
}));
exports.updateTicket = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['ticketId'] === 'string') {
        const ticket = yield ticketService.updateTicketById(new mongoose_1.default.Types.ObjectId(req.params['ticketId']), req.body);
        res.send(ticket);
    }
}));
exports.deleteTicket = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['ticketId'] === 'string') {
        yield ticketService.deleteTicketById(new mongoose_1.default.Types.ObjectId(req.params['ticketId']));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
