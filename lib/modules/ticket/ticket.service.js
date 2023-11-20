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
exports.deleteTicketById = exports.updateTicketById = exports.getTicketsByEvent = exports.getTicketByTransactionId = exports.getTicketsByUser = exports.getTicketById = exports.getTicketsByPrice = exports.getRevenueByOrganizer = exports.getTicketsByOrganizer = exports.getTickets = exports.createTicket = void 0;
const errors_1 = require("../errors");
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../user");
const event_1 = require("../event");
const ticket_model_1 = __importDefault(require("./ticket.model"));
const config_1 = __importDefault(require("../../config/config"));
/**
 * Create Ticket
 * @param { NewCreatedTicket } ticketBody
 * @returns { Promis<ITicketDoc | null> }
 */
const headers = {
    Authorization: `Bearer ${config_1.default.paystack.liveSecretKey}`
};
const createTicket = (ticketBody) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     await axios.get(`https://api.paystack.co/transaction/verify/${ticketBody.ticketId}`,  { headers }).then((res)=>{
    //         // console.log(res.data.status)
    //         const ticket = ticketModel.create(ticketBody);
    //         return ticket;
    //     })
    // } catch (err: any){
    //     // console.log(err);
    //     throw(new ApiError(httpStatus.FORBIDDEN, `Forbidden`));
    // }
    const ticket = ticket_model_1.default.create(ticketBody);
    return ticket;
});
exports.createTicket = createTicket;
/**
 * Get all the tickets
 * @returns {Promise<ITicketDoc | null>}
 */
const getTickets = () => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticket_model_1.default.find();
    if (!tickets) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No ticket available');
    }
    return tickets;
});
exports.getTickets = getTickets;
/**
 * Get all the tickets for a particular organizerId
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getTicketsByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticket_model_1.default.find({ organizer: organizerId });
    if (!tickets) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No tickets available');
    }
    return tickets;
});
exports.getTicketsByOrganizer = getTicketsByOrganizer;
/**
 * Get the revenue for a particular organizerId
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
const getRevenueByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_1.eventModel.find({ organizer: organizerId });
    const ticketsRevenue = [];
    for (const event of events) {
        const tickets = yield ticket_model_1.default.find({ event: event.id });
        for (const ticket of tickets) {
            let moneyMade = ticket.price - (250 * ticket.amount);
            let dateCreated = new Date(ticket.createdAt).toISOString().slice(0, 10);
            ticketsRevenue.push({ moneyMade, dateCreated });
        }
    }
    return ticketsRevenue;
});
exports.getRevenueByOrganizer = getRevenueByOrganizer;
/**
 * Get all the tickets for a particular price
 * @param {mongoose.Types.ObjectId} price
 * @returns {Promise<ICommandDoc | null>}
 */
const getTicketsByPrice = (price) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticket_model_1.default.find({ price: price });
    if (!tickets) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No tickets available');
    }
    return tickets;
});
exports.getTicketsByPrice = getTicketsByPrice;
/**
 * Get Ticket by Id
 * @param {mongoose.Types.ObjectId} ticketId
 * @returns {Promise<ITicketDoc | null>}
 */
const getTicketById = (ticketId) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield ticket_model_1.default.findById(ticketId);
    return ticket;
});
exports.getTicketById = getTicketById;
/**
 * Get Tickets by User
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ITicketDoc | null>}
 */
const getTicketsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticket_model_1.default.find({ user: userId });
    return tickets;
});
exports.getTicketsByUser = getTicketsByUser;
/**
 * Get Ticket by transactionId
 * @param {string} transactionId
 * @returns {Promise<ITicketDoc | null>}
 */
const getTicketByTransactionId = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield ticket_model_1.default.findOne({ ticketId: transactionId });
    const event = yield event_1.eventModel.findById(ticket === null || ticket === void 0 ? void 0 : ticket.event);
    if (!ticket) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, "Ticket not Found");
    }
    else {
        return [ticket, event];
    }
});
exports.getTicketByTransactionId = getTicketByTransactionId;
/**
 * Get Tickets by Event
 * @param {any} ticketEvent
 * @returns {Promise<ITicketDoc | null>}
 */
const getTicketsByEvent = (ticketEvent) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticket_model_1.default.find({ event: ticketEvent });
    return tickets;
});
exports.getTicketsByEvent = getTicketsByEvent;
// /**
//  * Get Tickets Analytics by Event
//  * @param {any} ticketEvent
//  * @returns {Promise<ITicketDoc | null>}
//  */
// export const getTicketAnalyticsByEvent = async(ticketEvent: any): Promise<ITicketDoc[] | any> => {
//     const tickets = await ticketModel.find({ event: ticketEvent });
//     try {
//         const tiketSalesPerDay = await eventModel.aggregate([
//             {
//                 $match: { event: mongoose.Types.ObjectId(ticketEvent) }
//             },
//             {
//                 $unwind: ""
//             }
//         ])
//     } catch (err){
//         return err;
//     }
//     return tickets;
// }
/**
 * Update a ticket by id
 * @param {mongoose.Types.ObjectId} ticketId
 * @param {UpdateTicketBody} updateBody
 * @returns {Promise<ITicketDoc | null>}
 */
const updateTicketById = (ticketId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield (0, exports.getTicketById)(ticketId);
    if (!ticket) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Ticket not found');
    }
    Object.assign(ticket, updateBody);
    yield ticket.save();
    return ticket;
});
exports.updateTicketById = updateTicketById;
/**
 * Delete Ticket by id
 * @param {mongoose.Types.ObjectId} ticketId
 * @returns {Promise<IInstructorDoc | null>}
 */
const deleteTicketById = (ticketId) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield (0, exports.getTicketById)(ticketId);
    if (!ticket) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Ticket not found');
    }
    const user = yield user_1.userModel.findById(ticket.user);
    if (user === null || user === void 0 ? void 0 : user.tickets.includes(ticketId)) {
        user === null || user === void 0 ? void 0 : user.tickets.splice(user === null || user === void 0 ? void 0 : user.tickets.indexOf(ticketId), 1);
        yield (user === null || user === void 0 ? void 0 : user.save());
    }
    else {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Ticket not found');
    }
    yield ticket_model_1.default.findOneAndRemove({ _id: ticketId });
    return ticket;
});
exports.deleteTicketById = deleteTicketById;
