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
exports.deletePayoutById = exports.updatePayoutById = exports.getPayoutsByEvent = exports.getAllPayoutsByOrganizer = exports.getAllPayouts = exports.getPayoutById = exports.createPayout = void 0;
const errors_1 = require("../errors");
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../user");
const event_1 = require("../event");
const payout_model_1 = __importDefault(require("./payout.model"));
const sendMail_1 = require("../utils/sendMail");
const isDateTimeGreaterThanCurrent = (dateTime) => {
    const currentDateTime = new Date();
    return dateTime > currentDateTime;
};
/**
 * Create Payout
 * @param { NewCreatedPayout } PayoutBody
 * @returns { Promis<IPayoutDoc | null> }
 */
const createPayout = (PayoutBody) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield payout_model_1.default.findOne({ organizerId: PayoutBody.organizerId, eventId: PayoutBody.eventId });
    const event = yield event_1.eventModel.findById(PayoutBody.eventId);
    if (check) {
        throw new errors_1.ApiError(http_status_1.default.FORBIDDEN, `You already requested for payout at ${new Date(check === null || check === void 0 ? void 0 : check.createdAt).toLocaleTimeString("en-US", {
            hour: 'numeric',
            minute: "numeric",
            hour12: true
        })}`);
    }
    else if (event.isEnded === false) {
        throw new errors_1.ApiError(http_status_1.default.FORBIDDEN, "You can't request for payout until after the event");
    }
    else {
        const Payout = yield payout_model_1.default.create(PayoutBody);
        const event = yield event_1.eventService.getEventById(PayoutBody.eventId);
        const user = yield user_1.userService.getUserById(PayoutBody.organizerId);
        (0, sendMail_1.sendMail)(user === null || user === void 0 ? void 0 : user.email, `You've requested Payout for ${event === null || event === void 0 ? void 0 : event.title} - Trietix`, { eventName: event === null || event === void 0 ? void 0 : event.title, organizerName: user === null || user === void 0 ? void 0 : user.name, accountName: user === null || user === void 0 ? void 0 : user.accountName, accountBank: user === null || user === void 0 ? void 0 : user.bank, payoutTime: Payout === null || Payout === void 0 ? void 0 : Payout.createdAt }, "organizer/payout.hbs");
        (0, sendMail_1.sendMail)("trietixhq@gmail.com", `${user === null || user === void 0 ? void 0 : user.name} requested Payout for ${event === null || event === void 0 ? void 0 : event.title} - Trietix`, { eventName: event === null || event === void 0 ? void 0 : event.title, organizerName: user === null || user === void 0 ? void 0 : user.name, accountName: user === null || user === void 0 ? void 0 : user.accountName, accountBank: user === null || user === void 0 ? void 0 : user.bank, payoutTime: Payout === null || Payout === void 0 ? void 0 : Payout.createdAt }, "guru/payout.hbs");
        return Payout;
    }
});
exports.createPayout = createPayout;
/**
 * Get Payout by Id
 * @param {mongoose.Types.ObjectId} PayouttId
 * @returns {Promise<IEventDoc | null>}
 */
const getPayoutById = (PayoutId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield payout_model_1.default.findById(PayoutId);
    return event;
});
exports.getPayoutById = getPayoutById;
/**
 * Get all the Payouts
 * @returns {Promise<IPayoutDoc | null>}
 */
const getAllPayouts = () => __awaiter(void 0, void 0, void 0, function* () {
    const Payouts = yield payout_model_1.default.find();
    if (!Payouts) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No Payout available');
    }
    return Payouts;
});
exports.getAllPayouts = getAllPayouts;
/**
 * Get all the Payouts for Organizer
 * @param {string} organizerId
 * @returns {Promise<IPayoutDoc | null>}
 */
const getAllPayoutsByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const Payouts = yield payout_model_1.default.find({ organizerId: organizerId });
    if (!Payouts) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No Payouts available');
    }
    return Payouts;
});
exports.getAllPayoutsByOrganizer = getAllPayoutsByOrganizer;
/**
 * Get all the Payouts according to the Events
 * @param {mongoose.types.ObjectId} eventId
 * @returns {Promise<IPayoutDoc | null>}
 */
const getPayoutsByEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const Payouts = yield payout_model_1.default.find({ eventId: eventId });
    if (!Payouts) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No Payouts available');
    }
    return Payouts;
});
exports.getPayoutsByEvent = getPayoutsByEvent;
/**
 * Update an Payout by id
 * @param {mongoose.Types.ObjectId} PayoutId
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
const updatePayoutById = (PayoutId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const Payout = yield (0, exports.getPayoutById)(PayoutId);
    if (!Payout) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Payout not found');
    }
    Object.assign(Payout, updateBody);
    yield Payout.save();
    return Payout;
});
exports.updatePayoutById = updatePayoutById;
/**
 * Delete Payout by id
 * @param {mongoose.Types.ObjectId} PayoutId
 * @returns {Promise<any | null>}
 */
const deletePayoutById = (PayoutId) => __awaiter(void 0, void 0, void 0, function* () {
    const Payout = yield (0, exports.getPayoutById)(PayoutId);
    if (!Payout) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Payout not found');
    }
    else {
        const user = yield user_1.userModel.findOne({ email: Payout === null || Payout === void 0 ? void 0 : Payout.email });
        yield payout_model_1.default.findOneAndRemove({ _id: PayoutId });
        return Payout;
    }
});
exports.deletePayoutById = deletePayoutById;
