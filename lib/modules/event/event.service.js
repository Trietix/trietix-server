"use strict";
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
exports.deleteEventByName = exports.deleteEventById = exports.updateEventByName = exports.updateEventById = exports.getRecentEventByTopOrganizer = exports.getEventByTitle = exports.getEventById = exports.getRecentEventsByOrganizer = exports.getEventVolunteersByOrganizer = exports.getEventTicketsByOrganizer = exports.getTicketsByOrganizer = exports.getEventByOrganizer = exports.getTopEventsByOrganizer = exports.getEventsByOrganizer = exports.getRecentEvents = exports.getTopEvents = exports.getAllInvites = exports.getEvent = exports.getEvents = exports.createEvent = void 0;
const errors_1 = require("../errors");
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../user");
const invites_1 = require("../invites");
const event_model_1 = __importDefault(require("./event.model"));
const ticket_1 = require("../ticket");
const isEventNameTaken = (title, excludeEventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findOne({ title, _id: { $ne: excludeEventId } });
    return !!event;
});
/**
 * Create Event
 * @param { NewCreatedEvent } eventBody
 * @returns { Promis<IEventDoc | null> }
 */
const createEvent = (eventBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isEventNameTaken(eventBody.title)) {
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Title already taken');
    }
    const event = yield event_model_1.default.create(eventBody);
    const user = yield user_1.userModel.findById(eventBody.organizer);
    if (user) {
        user.events.push(event.id);
        yield (user === null || user === void 0 ? void 0 : user.save());
    }
    return event;
});
exports.createEvent = createEvent;
/**
 * Get all the events
 * @returns {Promise<IEventDoc | null>}
 */
const getEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_model_1.default.find({ isEnded: false, isCancelled: false });
    if (!events) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No event available');
    }
    return events;
});
exports.getEvents = getEvents;
/**
 * Get the event by title
 * @param {string} eventTitle
 * @returns {Promise<ICommandDoc | null>}
 */
const getEvent = (eventTitle) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findOne({ title: eventTitle.split('-').join(' ') });
    // console.log(eventTitle.split('-').join(' '))
    // const event = await eventModel.findOne({ $or: [{title: eventTitle.split('-').join(' ')}, {url: eventTitle.split('-').join(' ')}] });
    // const anotherEvent = await eventModel.findOne({ url: eventTitle.split('-').join(' ') })
    // console.log(anotherEvent);
    return event;
});
exports.getEvent = getEvent;
/**
 * Get all the invites
 * @param {mongoose.Types.ObjectId} eventId
 * @returns {Promise<IInviteDoc | null>}
 */
const getAllInvites = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield invites_1.inviteModel.find({ eventId: eventId });
    if (!invites) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No invite available');
    }
    return invites;
});
exports.getAllInvites = getAllInvites;
/**
 * Get the top 3 events
 * @returns {Promise<IEventDoc | null>}
 */
const getTopEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_model_1.default.find().sort({ tickets: -1 }).limit(3);
    if (!events) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No event available');
    }
    return events;
});
exports.getTopEvents = getTopEvents;
/**
 * Get the recent events
 * @returns {Promise<IEventDoc | null>}
 */
const getRecentEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_model_1.default.find().sort({ createdAt: -1 }).limit(3);
    if (!events) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No event available');
    }
    return events;
});
exports.getRecentEvents = getRecentEvents;
/**
 * Get all the events for a particular userId
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getEventsByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userModel.findOne({ _id: organizerId });
    if (user) {
        const events = yield event_model_1.default.find({ organizer: organizerId });
        if (!events) {
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No events available');
        }
        return events;
    }
    else {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Organizer not found');
    }
});
exports.getEventsByOrganizer = getEventsByOrganizer;
/**
 * Get all the top events for a particular organizer
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getTopEventsByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_model_1.default.find({ organizer: organizerId }).sort({ tickets: -1 }).limit(3);
    if (!events) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No events available');
    }
    return events;
});
exports.getTopEventsByOrganizer = getTopEventsByOrganizer;
/**
 * Get the event for a particular organizer
 * @param {string} eventTitle
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getEventByOrganizer = (eventTitle, organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findOne({ title: eventTitle.split('-').join(' '), organizer: organizerId });
    return event;
});
exports.getEventByOrganizer = getEventByOrganizer;
/**
 * Get the tickets for a particular organizer
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getTicketsByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield (0, exports.getEventsByOrganizer)(organizerId);
    const tickets = events.map((event) => __awaiter(void 0, void 0, void 0, function* () { return yield ticket_1.ticketModel.find({ event: event }); }));
    return tickets;
});
exports.getTicketsByOrganizer = getTicketsByOrganizer;
/**
 * Get the event tickets for a particular organizer
 * @param {string} eventTitle
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getEventTicketsByOrganizer = (eventTitle, organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findOne({ title: eventTitle.split('-').join(' '), organizer: organizerId });
    console.log(event);
    const tickets = yield ticket_1.ticketModel.find({ event: event === null || event === void 0 ? void 0 : event._id });
    return tickets;
});
exports.getEventTicketsByOrganizer = getEventTicketsByOrganizer;
/**
 * Get the event volunteers for a particular organizer
 * @param {string} eventTitle
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getEventVolunteersByOrganizer = (eventTitle, organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findOne({ title: eventTitle.split('-').join(' '), organizer: organizerId });
    const volunteers = yield invites_1.inviteModel.find({ eventId: event === null || event === void 0 ? void 0 : event._id });
    return volunteers;
});
exports.getEventVolunteersByOrganizer = getEventVolunteersByOrganizer;
/**
 * Get all the recent events for a particular organizer
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getRecentEventsByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_model_1.default.find({ organizer: organizerId }).sort({ createdAt: -1 }).limit(3);
    if (!events) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No events available');
    }
    return events;
});
exports.getRecentEventsByOrganizer = getRecentEventsByOrganizer;
/**
 * Get Event by Id
 * @param {mongoose.Types.ObjectId} eventId
 * @returns {Promise<IEventDoc | null>}
 */
const getEventById = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findById(eventId);
    return event;
});
exports.getEventById = getEventById;
/**
 * Get Event by title
 * @param {string} eventTitle
 * @returns {Promise<IEventDoc | null>}
 */
const getEventByTitle = (eventTitle) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.default.findOne({ $or: [{ url: eventTitle.split('-').join(' ') }, { title: eventTitle.split('-').join(' ') }] });
    console.log(eventTitle.split('-').join(' '));
    const anotherEvent = yield event_model_1.default.findOne({ url: eventTitle.split('-').join(' ') });
    console.log(anotherEvent);
    return event;
});
exports.getEventByTitle = getEventByTitle;
/**
 * Get Recent Event By Top Organizer
 */
const getRecentEventByTopOrganizer = () => __awaiter(void 0, void 0, void 0, function* () {
    const organizer = yield user_1.userModel.find({ role: 'organizer' }).sort({ events: -1 }).limit(3);
    const recentEvent = yield event_model_1.default.find({ organizer: organizer[0]._id, isEnded: true }).sort({ createdAt: -1 });
    return recentEvent[0];
});
exports.getRecentEventByTopOrganizer = getRecentEventByTopOrganizer;
/**
 * Update a event by id
 * @param {mongoose.Types.ObjectId} eventId
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
const updateEventById = (eventId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield (0, exports.getEventById)(eventId);
    if (!event) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Event not found');
    }
    if (updateBody.title && (yield isEventNameTaken(updateBody.title, eventId))) {
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Name already taken');
    }
    Object.assign(event, updateBody);
    yield event.save();
    return event;
});
exports.updateEventById = updateEventById;
/**
 * Update a event by name
 * @param {string} eventTitle
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
const updateEventByName = (eventTitle, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield (0, exports.getEventByTitle)(eventTitle);
    if (!event) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Event not found');
    }
    if (updateBody.title && (yield isEventNameTaken(updateBody.title, event._id))) {
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Name already taken');
    }
    Object.assign(event, updateBody);
    yield event.save();
    return event;
});
exports.updateEventByName = updateEventByName;
/**
 * Delete Event by id
 * @param {mongoose.Types.ObjectId} eventId
 * @returns {Promise<IInstructorDoc | null>}
 */
const deleteEventById = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield (0, exports.getEventById)(eventId);
    if (!event) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Event not found');
    }
    const user = yield user_1.userModel.findById(event.organizer);
    yield ticket_1.ticketModel.deleteMany({ event: event._id });
    yield invites_1.inviteModel.deleteMany({ eventId: event._id });
    if (user === null || user === void 0 ? void 0 : user.eventsAttended.includes(eventId)) {
        user === null || user === void 0 ? void 0 : user.eventsAttended.splice(user === null || user === void 0 ? void 0 : user.eventsAttended.indexOf(eventId), 1);
        yield (user === null || user === void 0 ? void 0 : user.save());
    }
    else {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Event not found');
    }
    yield event_model_1.default.findOneAndRemove({ _id: eventId });
    return event;
});
exports.deleteEventById = deleteEventById;
/**
 * Delete Event by name
 * @param {string} eventTitle
 * @returns {Promise<IInstructorDoc | null>}
 */
const deleteEventByName = (eventTitle) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield (0, exports.getEventByTitle)(eventTitle);
    if (!event) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Event not found');
    }
    const user = yield user_1.userModel.findById(event.organizer);
    yield ticket_1.ticketModel.deleteMany({ event: event._id });
    yield invites_1.inviteModel.deleteMany({ eventId: event._id });
    if (user === null || user === void 0 ? void 0 : user.eventsAttended.includes(event.id)) {
        user === null || user === void 0 ? void 0 : user.eventsAttended.splice(user === null || user === void 0 ? void 0 : user.eventsAttended.indexOf(event.id), 1);
        yield (user === null || user === void 0 ? void 0 : user.save());
    }
    else {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Event not found');
    }
    yield event_model_1.default.findOneAndRemove({ name: eventTitle });
    return event;
});
exports.deleteEventByName = deleteEventByName;
