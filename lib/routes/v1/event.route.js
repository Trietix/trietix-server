"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const event_1 = require("../../modules/event");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.createEvent), event_1.eventController.createEvent)
    .get((0, validate_1.validate)(event_1.eventValidation.getEvents), event_1.eventController.getEvents);
router
    .route('/organizer/top/recent')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getRecentEventByTopOrganizer), event_1.eventController.getRecentEventByTopOrganizer);
router
    .route('/organizer/:organizer')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventsByOrganizer), event_1.eventController.getEventsByOrganizer);
router
    .route('/organizer/:organizer/title/:title')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventByOrganizer), event_1.eventController.getEventByOrganizer);
router
    .route('/organizer/:organizer/title/:title/tickets')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventTicketsByOrganizer), event_1.eventController.getEventTicketsByOrganizer);
router
    .route('/organizer/:organizer/title/:title/volunteers')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventVolunteersByOrganizer), event_1.eventController.getEventVolunteersByOrganizer);
router
    .route('/title/:title')
    .get((0, validate_1.validate)(event_1.eventValidation.getEventByTitle), event_1.eventController.getEventByTitle);
router
    .route('/:eventId')
    .get((0, auth_1.auth)('manageEvents'), (0, validate_1.validate)(event_1.eventValidation.getEvent), event_1.eventController.getEvent)
    .patch((0, auth_1.auth)('updateEvents'), (0, validate_1.validate)(event_1.eventValidation.updateEvent), event_1.eventController.updateEvent)
    .delete((0, auth_1.auth)('deleteEvents'), (0, validate_1.validate)(event_1.eventValidation.deleteEvent), event_1.eventController.deleteEvent);
exports.default = router;
