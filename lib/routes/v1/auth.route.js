"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const router = express_1.default.Router();
router.post('/register', (0, validate_1.validate)(auth_1.authValidation.register), auth_1.authController.register);
router.post('/login', (0, validate_1.validate)(auth_1.authValidation.login), auth_1.authController.login);
router.route('/logout').post((0, auth_1.auth)(), (0, validate_1.validate)(auth_1.authValidation.logout), auth_1.authController.logout);
router.route('/refresh-tokens').post((0, validate_1.validate)(auth_1.authValidation.refreshTokens), auth_1.authController.refreshTokens);
exports.default = router;
