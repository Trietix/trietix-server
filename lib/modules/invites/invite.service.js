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
exports.deleteInviteById = exports.updateInviteById = exports.getInvitesByEvent = exports.getAllInvitesByUser = exports.getAllInvites = exports.getInviteById = exports.createInvite = void 0;
const errors_1 = require("../errors");
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../user");
const event_1 = require("../event");
const invite_model_1 = __importDefault(require("./invite.model"));
/**
 * Create Invite
 * @param { NewCreatedInvite } inviteBody
 * @returns { Promis<IInviteDoc | null> }
 */
const createInvite = (inviteBody) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield invite_model_1.default.findOne({ email: inviteBody.email, eventId: inviteBody.eventId });
    if (check) {
        throw new errors_1.ApiError(http_status_1.default.FORBIDDEN, "Invite already exists");
    }
    else {
        const user = yield user_1.userModel.findOne({ email: inviteBody.email });
        const event = yield event_1.eventModel.findById(inviteBody.eventId);
        if (event.isEnded === true) {
            throw new errors_1.ApiError(http_status_1.default.FORBIDDEN, "You can't invite anyone since your event has ended");
        }
        else if (!user) {
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, "User not found");
        }
        else if ((user === null || user === void 0 ? void 0 : user.role) === "organizer" || (user === null || user === void 0 ? void 0 : user.role) === "admin") {
            throw new errors_1.ApiError(http_status_1.default.FORBIDDEN, "You can't invite this user");
        }
        else {
            const invite = yield invite_model_1.default.create(inviteBody);
            console.log(user);
            if (!(user === null || user === void 0 ? void 0 : user.invitations.includes(invite === null || invite === void 0 ? void 0 : invite._id))) {
                user === null || user === void 0 ? void 0 : user.invitations.push(invite === null || invite === void 0 ? void 0 : invite._id);
                event === null || event === void 0 ? void 0 : event.invites.push(invite === null || invite === void 0 ? void 0 : invite._id);
                yield (event === null || event === void 0 ? void 0 : event.save());
                yield (user === null || user === void 0 ? void 0 : user.save());
            }
            else {
                throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Invite already exists');
            }
            return invite;
        }
    }
});
exports.createInvite = createInvite;
/**
 * Get Invite by Id
 * @param {mongoose.Types.ObjectId} invitetId
 * @returns {Promise<IEventDoc | null>}
 */
const getInviteById = (inviteId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield invite_model_1.default.findById(inviteId);
    return event;
});
exports.getInviteById = getInviteById;
/**
 * Get all the invites
 * @returns {Promise<IInviteDoc | null>}
 */
const getAllInvites = () => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield invite_model_1.default.find();
    if (!invites) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No invite available');
    }
    return invites;
});
exports.getAllInvites = getAllInvites;
/**
 * Get all the invites for User
 * @param {string} email
 * @returns {Promise<IInviteDoc | null>}
 */
const getAllInvitesByUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield invite_model_1.default.find({ email: email });
    if (!invites) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No invites available');
    }
    return invites;
});
exports.getAllInvitesByUser = getAllInvitesByUser;
/**
 * Get all the invites according to the Events
 * @param {mongoose.types.ObjectId} eventId
 * @returns {Promise<IInviteDoc | null>}
 */
const getInvitesByEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield invite_model_1.default.find({ eventId: eventId });
    if (!invites) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No invites available');
    }
    return invites;
});
exports.getInvitesByEvent = getInvitesByEvent;
/**
 * Update an invite by id
 * @param {mongoose.Types.ObjectId} inviteId
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
const updateInviteById = (inviteId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const invite = yield (0, exports.getInviteById)(inviteId);
    if (!invite) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Invite not found');
    }
    Object.assign(invite, updateBody);
    yield invite.save();
    return invite;
});
exports.updateInviteById = updateInviteById;
/**
 * Delete Invite by id
 * @param {mongoose.Types.ObjectId} inviteId
 * @returns {Promise<IInviteDoc | null>}
 */
const deleteInviteById = (inviteId) => __awaiter(void 0, void 0, void 0, function* () {
    const invite = yield (0, exports.getInviteById)(inviteId);
    if (!invite) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Invite not found');
    }
    else {
        const user = yield user_1.userModel.findOne({ email: invite.email });
        const event = yield event_1.eventModel.findById(invite.eventId);
        if (user === null || user === void 0 ? void 0 : user.invitations.includes(inviteId)) {
            user === null || user === void 0 ? void 0 : user.invitations.splice(user === null || user === void 0 ? void 0 : user.invitations.indexOf(inviteId), 1);
            yield (user === null || user === void 0 ? void 0 : user.save());
        }
        else {
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Invite not found');
        }
        if (event === null || event === void 0 ? void 0 : event.invites.includes(inviteId)) {
            event === null || event === void 0 ? void 0 : event.invites.splice(event === null || event === void 0 ? void 0 : event.invites.indexOf(inviteId), 1);
            yield (event === null || event === void 0 ? void 0 : event.save());
        }
        else {
            throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Invite not found');
        }
        yield invite_model_1.default.findOneAndRemove({ _id: inviteId });
        return invite;
    }
});
exports.deleteInviteById = deleteInviteById;
