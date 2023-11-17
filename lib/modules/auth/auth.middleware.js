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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config/config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyCallback = (req, resolve, reject, requiredRights) => (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Error - ${err}`);
    console.log(`Info - ${info}`);
    if (err || info || !user) {
        return reject(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    console.log(req.user);
    resolve();
});
const authMiddleware = (...requiredRights) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        var _a, _b, _c;
        if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer", "")) {
            let token = (_c = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.replace("Bearer ", "");
            if (token) {
                jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret, (err, decoded) => {
                    if (err) {
                        return reject(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate'));
                    }
                    resolve();
                    req.user = decoded;
                    next();
                });
            }
            else {
                return reject(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate'));
            }
        }
        else {
            return reject(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate'));
        }
    })
        .catch((err) => next(err));
});
exports.default = authMiddleware;
