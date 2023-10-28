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
    .route('/top-events')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getTopEvents), event_1.eventController.getTopEvents);
router
    .route('/recent-events')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getRecentEvents), event_1.eventController.getRecentEvents);
router
    .route('/organizer/:organizer')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventsByOrganizer), event_1.eventController.getEventsByOrganizer);
router
    .route('/organizer/:organizer/recent-events')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getRecentEventsByOrganizer), event_1.eventController.getRecentEventsByOrganizer);
router
    .route('/organizer/:organizer/top-events')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getTopEventsByOrganizer), event_1.eventController.getTopEventsByOrganizer);
router
    .route('/price/:eventPrice')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventsByPrice), event_1.eventController.getEventsByPrice);
router
    .route('/category/:eventCategory')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventsByCategory), event_1.eventController.getEventsByCategory);
router
    .route('/title/:title')
    .get((0, validate_1.validate)(event_1.eventValidation.getEventByTitle), event_1.eventController.getEventByTitle);
router
    .route('/title/:title/tickets')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventTickets), event_1.eventController.getEventTickets);
router
    .route('/title/:title/volunteers')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(event_1.eventValidation.getEventVolunteers), event_1.eventController.getEventVolunteers);
// router
//     .route('/title/:eventTitle/revenue')
//     .get(auth(), validate(eventValidation.getEventRevenue), eventController.getEventRevenue)
router
    .route('/:eventId')
    .get((0, auth_1.auth)('manageEvents'), (0, validate_1.validate)(event_1.eventValidation.getEvent), event_1.eventController.getEvent)
    .patch((0, auth_1.auth)('updateEvents'), (0, validate_1.validate)(event_1.eventValidation.updateEvent), event_1.eventController.updateEvent)
    .delete((0, auth_1.auth)('deleteEvents'), (0, validate_1.validate)(event_1.eventValidation.deleteEvent), event_1.eventController.deleteEvent);
exports.default = router;
