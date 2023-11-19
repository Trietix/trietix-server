"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const ticket_1 = require("../../modules/ticket");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, validate_1.validate)(ticket_1.ticketValidation.createTicket), ticket_1.ticketController.createTicket)
    .get((0, auth_1.auth)(), (0, validate_1.validate)(ticket_1.ticketValidation.getTickets), ticket_1.ticketController.getTickets);
router
    .route('/organizer/:organizer')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(ticket_1.ticketValidation.getTicketsByOrganizer), ticket_1.ticketController.getTicketsByOrganizer);
router
    .route('/organizer/revenue/:organizer')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(ticket_1.ticketValidation.getRevenueByOrganizer), ticket_1.ticketController.getRevenueByOrganizer);
router
    .route('/user/:userId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(ticket_1.ticketValidation.getTicketsByUser), ticket_1.ticketController.getTicketsByUser);
router
    .route('/price/:ticketPrice')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(ticket_1.ticketValidation.getTicketsByPrice), ticket_1.ticketController.getTicketsByPrice);
router
    .route('/:ticketId')
    .get((0, auth_1.auth)('manageTickets'), (0, validate_1.validate)(ticket_1.ticketValidation.getTicket), ticket_1.ticketController.getTicket)
    .patch((0, auth_1.auth)('updateTickets'), (0, validate_1.validate)(ticket_1.ticketValidation.updateTicket), ticket_1.ticketController.updateTicket)
    .delete((0, auth_1.auth)('deleteTickets'), (0, validate_1.validate)(ticket_1.ticketValidation.deleteTicket), ticket_1.ticketController.deleteTicket);
router
    .route('/get/:transactionId')
    .get((0, validate_1.validate)(ticket_1.ticketValidation.getTicketByTransactionId), ticket_1.ticketController.getTicketByTransactionId);
exports.default = router;
