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
exports.refreshAuth = exports.logout = exports.loginUserWithEmailAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const token_model_1 = __importDefault(require("../token/token.model"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const token_types_1 = __importDefault(require("../token/token.types"));
const user_service_1 = require("../user/user.service");
const token_service_1 = require("../token/token.service");
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
const loginUserWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (!user || !(yield user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
});
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenDoc = yield token_model_1.default.findOne({ token: refreshToken, type: token_types_1.default.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found');
    }
    yield refreshTokenDoc.deleteOne();
});
exports.logout = logout;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
const refreshAuth = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(refreshToken);
    try {
        const refreshTokenDoc = yield (0, token_service_1.verifyToken)(refreshToken, token_types_1.default.REFRESH);
        const user = yield (0, user_service_1.getUserById)(new mongoose_1.default.Types.ObjectId(refreshTokenDoc.user));
        if (!user) {
            throw new Error();
        }
        yield refreshTokenDoc.deleteOne();
        const tokens = yield (0, token_service_1.generateAuthTokens)(user);
        return { user, tokens };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, error);
    }
});
exports.refreshAuth = refreshAuth;
