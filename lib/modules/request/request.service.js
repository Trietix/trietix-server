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
exports.deleteRequestById = exports.updateRequestById = exports.getAllRequestsByOrganizer = exports.getAllRequests = exports.getRequestById = exports.createRequest = void 0;
const errors_1 = require("../errors");
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../user");
const request_model_1 = __importDefault(require("./request.model"));
const sendMail_1 = require("../utils/sendMail");
/**
 * Create Request
 * @param { NewCreatedRequest } RequestBody
 * @returns { Promis<IRequestDoc | null> }
 */
const createRequest = (RequestBody) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield request_model_1.default.findOne({ organizerId: RequestBody.organizerId, status: "pending" });
    if (check) {
        throw new errors_1.ApiError(http_status_1.default.FORBIDDEN, `You already requested for verification at ${new Date(check.createdAt).toLocaleString()}`);
    }
    else {
        const Request = yield request_model_1.default.create(RequestBody);
        const user = yield user_1.userService.getUserById(RequestBody.organizerId);
        (0, sendMail_1.sendMail)(user === null || user === void 0 ? void 0 : user.email, `You've requested verification for your account - Trietix`, { organizerName: user === null || user === void 0 ? void 0 : user.name, accountName: user === null || user === void 0 ? void 0 : user.accountName, accountBank: user === null || user === void 0 ? void 0 : user.bank, requestTime: Request === null || Request === void 0 ? void 0 : Request.createdAt }, "organizer/request.hbs");
        (0, sendMail_1.sendMail)("trietixhq@gmail.com", `${user === null || user === void 0 ? void 0 : user.name} requested verification for their account - Trietix`, { organizerName: user === null || user === void 0 ? void 0 : user.name, url: `https://guru.trietix.com/request/${Request._id}` }, "guru/request.hbs");
        return Request;
    }
});
exports.createRequest = createRequest;
/**
 * Get Request by Id
 * @param {mongoose.Types.ObjectId} RequesttId
 * @returns {Promise<IEventDoc | null>}
 */
const getRequestById = (RequestId) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield request_model_1.default.findById(RequestId);
    return request;
});
exports.getRequestById = getRequestById;
/**
 * Get all the Requests
 * @returns {Promise<IRequestDoc | null>}
 */
const getAllRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield request_model_1.default.find();
    if (!requests) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No Request available');
    }
    return requests;
});
exports.getAllRequests = getAllRequests;
/**
 * Get all the Requests for Organizer
 * @param {string} organizerId
 * @returns {Promise<IRequestDoc | null>}
 */
const getAllRequestsByOrganizer = (organizerId) => __awaiter(void 0, void 0, void 0, function* () {
    const Requests = yield request_model_1.default.find({ organizerId: organizerId });
    if (!Requests) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'No Requests available');
    }
    return Requests;
});
exports.getAllRequestsByOrganizer = getAllRequestsByOrganizer;
/**
 * Update an Request by id
 * @param {mongoose.Types.ObjectId} RequestId
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
const updateRequestById = (RequestId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const Request = yield (0, exports.getRequestById)(RequestId);
    if (!Request) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Request not found');
    }
    Object.assign(Request, updateBody);
    yield Request.save();
    return Request;
});
exports.updateRequestById = updateRequestById;
/**
 * Delete Request by id
 * @param {mongoose.Types.ObjectId} RequestId
 * @returns {Promise<any | null>}
 */
const deleteRequestById = (RequestId) => __awaiter(void 0, void 0, void 0, function* () {
    const Request = yield (0, exports.getRequestById)(RequestId);
    if (!Request) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Request not found');
    }
    else {
        yield request_model_1.default.findOneAndRemove({ _id: RequestId });
        return Request;
    }
});
exports.deleteRequestById = deleteRequestById;
