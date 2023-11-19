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
exports.deleteRequest = exports.updateRequest = exports.declineRequest = exports.acceptRequest = exports.getRequest = exports.getRequestsByOrganizer = exports.getAllRequests = exports.createRequest = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const RequestService = __importStar(require("./request.service"));
const userService = __importStar(require("../user/user.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../../config/config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloudName,
    api_key: config_1.default.cloudinary.apiKey,
    api_secret: config_1.default.cloudinary.apiSecret,
});
exports.createRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const presidentId = yield cloudinary_1.v2.uploader.upload(req.body.presidentId);
    const Request = yield RequestService.createRequest(Object.assign(Object.assign({}, req.body), { presidentId: presidentId.url }));
    res.status(http_status_1.default.CREATED).send(Request);
}));
exports.getAllRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Request = yield RequestService.getAllRequests();
    if (!Request) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Requests not found');
    }
    res.send(Request);
}));
exports.getRequestsByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const RequestS = yield RequestService.getAllRequestsByOrganizer(req.params['organizerId']);
    if (!RequestS) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Requests not found');
    }
    res.send(RequestS);
}));
exports.getRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['RequestId'] === 'string') {
        const Request = yield RequestService.getRequestById(new mongoose_1.default.Types.ObjectId(req.params['RequestId']));
        if (!Request) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Request not found');
        }
        res.send(Request);
    }
}));
exports.acceptRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['RequestId'] === 'string') {
        const Request = yield RequestService.updateRequestById(new mongoose_1.default.Types.ObjectId(req.params['RequestId']), { status: "accepted" });
        const user = userService.updateUserById(new mongoose_1.default.Types.ObjectId(Request === null || Request === void 0 ? void 0 : Request.organizerId), { isVerified: true });
        res.send([Request, user]);
    }
}));
exports.declineRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['RequestId'] === 'string') {
        const Request = yield RequestService.updateRequestById(new mongoose_1.default.Types.ObjectId(req.params['RequestId']), { status: "declined" });
        res.send(Request);
    }
}));
exports.updateRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['RequestId'] === 'string') {
        const Request = yield RequestService.updateRequestById(new mongoose_1.default.Types.ObjectId(req.params['RequestId']), req.body);
        res.send(Request);
    }
}));
exports.deleteRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['RequestId'] === 'string') {
        yield RequestService.deleteRequestById(new mongoose_1.default.Types.ObjectId(req.params['RequestId']));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
