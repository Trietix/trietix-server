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
exports.deleteUser = exports.updateUser = exports.getMe = exports.getUser = exports.getRecentOrganizers = exports.getTopOrganizers = exports.getOrganizers = exports.getAllInvitations = exports.getUsers = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const userService = __importStar(require("./user.service"));
exports.createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.registerUser(Object.assign(Object.assign({}, req.body), { username: req.body.email.match(/.*?(?=@)/) }));
    res.status(http_status_1.default.CREATED).send(user);
}));
exports.getUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.getAllUsers();
    res.status(http_status_1.default.FOUND).send(users);
}));
exports.getAllInvitations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invitations = yield userService.getAllInvitations(req.body.email);
    res.status(http_status_1.default.FOUND).send(invitations);
}));
exports.getOrganizers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.getAllOrganizers();
    res.status(http_status_1.default.FOUND).send(users);
}));
exports.getTopOrganizers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.getTopOrganizers();
    res.status(http_status_1.default.FOUND).send(users);
}));
exports.getRecentOrganizers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.getRecentOrganizers();
    res.status(http_status_1.default.FOUND).send(users);
}));
exports.getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['userId'] === 'string') {
        const user = yield userService.getUserById(new mongoose_1.default.Types.ObjectId(req.params['userId']));
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        res.send(user);
    }
}));
exports.getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_1.default.NOT_FOUND);
    }
    res.status(http_status_1.default.OK).send(user);
}));
exports.updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['userId'] === 'string') {
        // let photoUrl;
        // if(req.body.photo){
        //   photoUrl = req.body.photo;
        // } else {
        //   photoUrl = await cloudinary.uploader.upload(req.body.photo);
        // }
        // ? { ...req.body, photo: photoUrl } : req.body
        const user = yield userService.updateUserById(new mongoose_1.default.Types.ObjectId(req.params['userId']), req.body);
        res.send(user);
    }
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['userId'] === 'string') {
        yield userService.deleteUserById(new mongoose_1.default.Types.ObjectId(req.params['userId']));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
