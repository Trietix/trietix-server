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
const roles_1 = require("../../config/roles");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const verifyCallback =
//   (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
//   async (err: Error, user: IUserDoc, info: string) => {
//     console.log(`Error - ${err}`)
//     console.log(`Info - ${info}`)
//     if (err || info || !user) {
//       return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
//     }
//     req.user = user;
//     console.log(req.user)
//     resolve();
//   };
const verifyCallback = (req, resolve, reject, requiredRights) => (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (err || info || !user) {
        return reject(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    if (requiredRights.length) {
        const userRights = roles_1.roleRights.get(user.role);
        if (!userRights)
            return reject(new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden'));
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights && req.params['userId'] !== user.id) {
            return reject(new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden'));
        }
    }
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
                    console.log(decoded);
                    if (requiredRights.length) {
                        const userRights = roles_1.roleRights.get(decoded.role);
                        if (!userRights)
                            return reject(new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden'));
                        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
                        if (!hasRequiredRights && req.params['userId'] !== decoded.id) {
                            return reject(new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden'));
                        }
                    }
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
