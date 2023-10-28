"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const payout_1 = require("../../modules/payout");
const router = express_1.default.Router();
router
    .route('/organizer/:organizer')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(payout_1.payoutValidation.getPayoutsByOrganizer), payout_1.payoutController.getPayoutsByOrganizer);
router
    .route('/event/:eventId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(payout_1.payoutValidation.getPayoutsByEvent), payout_1.payoutController.getPayoutsByEvent);
router
    .route('/')
    .post((0, auth_1.auth)(), (0, validate_1.validate)(payout_1.payoutValidation.createPayout), payout_1.payoutController.createPayout);
router
    .route('/:payoutId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(payout_1.payoutValidation.getPayout), payout_1.payoutController.getPayout)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(payout_1.payoutValidation.updatePayout), payout_1.payoutController.updatePayout)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(payout_1.payoutValidation.deletePayout), payout_1.payoutController.deletePayout);
exports.default = router;
