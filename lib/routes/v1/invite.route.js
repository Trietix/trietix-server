"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const invites_1 = require("../../modules/invites");
const router = express_1.default.Router();
router
    .route('/user/:email')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(invites_1.inviteValidation.getInvitesByUser), invites_1.inviteController.getInvitesByUser);
router
    .route('/event/:eventId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(invites_1.inviteValidation.getInvitesByEvent), invites_1.inviteController.getInvitesByEvent);
router
    .route('/')
    .post((0, auth_1.auth)(), (0, validate_1.validate)(invites_1.inviteValidation.createInvite), invites_1.inviteController.createInvite);
router
    .route('/:inviteId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(invites_1.inviteValidation.getInvite), invites_1.inviteController.getInvite)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(invites_1.inviteValidation.updateInvite), invites_1.inviteController.updateInvite)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(invites_1.inviteValidation.deleteInvite), invites_1.inviteController.deleteInvite);
exports.default = router;
