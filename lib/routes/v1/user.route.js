"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const user_1 = require("../../modules/user");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, validate_1.validate)(user_1.userValidation.createUser), user_1.userController.createUser)
    .get((0, auth_1.auth)(), (0, validate_1.validate)(user_1.userValidation.getUsers), user_1.userController.getUsers);
router
    .route('/me')
    .get((0, auth_1.auth)('getAccount'), user_1.userController.getMe);
router
    .route('/organizers')
    .get((0, auth_1.auth)('getOrganizers'), (0, validate_1.validate)(user_1.userValidation.getOrganizers), user_1.userController.getOrganizers);
router
    .route('/top-organizers')
    .get((0, auth_1.auth)('getTopOrganizers'), (0, validate_1.validate)(user_1.userValidation.getTopOrganizers), user_1.userController.getTopOrganizers);
router
    .route('/:userId')
    .get((0, auth_1.auth)('getUsers'), (0, validate_1.validate)(user_1.userValidation.getUser), user_1.userController.getUser)
    .patch((0, auth_1.auth)('updateUser'), (0, validate_1.validate)(user_1.userValidation.updateUser), user_1.userController.updateUser)
    .delete((0, auth_1.auth)('deleteUser'), (0, validate_1.validate)(user_1.userValidation.deleteUser), user_1.userController.deleteUser);
exports.default = router;
