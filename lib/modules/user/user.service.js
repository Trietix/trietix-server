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
exports.deleteUserById = exports.updateUserById = exports.getRecentOrganizers = exports.getTopOrganizer = exports.getTopOrganizers = exports.getAllInvitations = exports.getAllOrganizers = exports.getAllUsers = exports.getUserByEmail = exports.getUserById = exports.registerUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const errors_1 = require("../errors");
const user_1 = require("../user");
const invites_1 = require("../invites");
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../../config/config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloudName,
    api_key: config_1.default.cloudinary.apiKey,
    api_secret: config_1.default.cloudinary.apiSecret,
});
const isEmailTaken = (email, excludeUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userModel.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
});
/**
 * Register as user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc| null>}
 */
const registerUser = (userBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isEmailTaken(userBody.email)) {
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    else {
        const { photo } = userBody;
        let pattern = /api\.dicebear\.com/;
        let photoUrl;
        let mainUrl;
        if (pattern.test(photo)) {
            photoUrl = photo;
        }
        else {
            mainUrl = yield cloudinary_1.v2.uploader.upload(photo);
        }
        const newUser = yield user_1.userModel.create(Object.assign(Object.assign({}, userBody), { photo: mainUrl ? mainUrl.url : photoUrl }));
        return newUser;
    }
});
exports.registerUser = registerUser;
/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () { return user_1.userModel.findById(id); });
exports.getUserById = getUserById;
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return user_1.userModel.findOne({ email }); });
exports.getUserByEmail = getUserByEmail;
/**
 * Get all users
 * @returns {Promis<IUserDoc[] | null>}
 */
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.userModel.find();
    return users;
});
exports.getAllUsers = getAllUsers;
/**
 * Get all organizers
 * @returns {Promis<IUserDoc[] | null>}
 */
const getAllOrganizers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.userModel.find({ role: 'organizer' });
    return users;
});
exports.getAllOrganizers = getAllOrganizers;
/**
 * Get all the invitations
 * @param {mongoose.Types.ObjectId} email
 * @returns {Promise<IInviteDoc | null>}
 */
const getAllInvitations = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const invites = yield invites_1.inviteModel.find({ email: email });
    if (!invites) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No invitations available');
    }
    return invites;
});
exports.getAllInvitations = getAllInvitations;
/**
 * Get all top organizers
 * @returns {Promis<IUserDoc[] | null>}
 */
const getTopOrganizers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.userModel.find({ role: 'organizer' }).sort({ events: -1 }).limit(3);
    return users;
});
exports.getTopOrganizers = getTopOrganizers;
/**
 * Get top organizer
 * @returns {Promis<IUserDoc| null>}
 */
const getTopOrganizer = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userModel.find({ role: 'organizer' }).sort({ events: -1 }).limit(1);
    return user;
});
exports.getTopOrganizer = getTopOrganizer;
/**
 * Get recent organizers
 * @returns {Promis<IUserDoc[] | null>}
 */
const getRecentOrganizers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.userModel.find({ role: 'organizer' }).sort({ createdAt: -1 }).limit(3);
    return users;
});
exports.getRecentOrganizers = getRecentOrganizers;
/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
const updateUserById = (userId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserById)(userId);
    if (!user) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (yield isEmailTaken(updateBody.email, userId))) {
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    else {
        let pattern = /api\.dicebear\.com/;
        let mainUrl;
        let photoUrl;
        if (pattern.test(updateBody.photo)) {
            photoUrl = updateBody.photo;
        }
        else {
            mainUrl = yield cloudinary_1.v2.uploader.upload(updateBody.photo);
        }
        Object.assign(user, Object.assign(Object.assign({}, updateBody), { photo: mainUrl ? mainUrl.url : photoUrl }));
        yield user.save();
        return user;
    }
});
exports.updateUserById = updateUserById;
/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserById)(userId);
    if (!user) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield user_1.userModel.findOneAndRemove({ _id: userId });
    return user;
});
exports.deleteUserById = deleteUserById;
