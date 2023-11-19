"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const request_1 = require("../../modules/request");
const router = express_1.default.Router();
router
    .route('/organizer/:organizer')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(request_1.requestValidation.getRequestsByOrganizer), request_1.requestController.getRequestsByOrganizer);
router
    .route('/')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(request_1.requestValidation.getAllRequests), request_1.requestController.getAllRequests)
    .post((0, auth_1.auth)(), (0, validate_1.validate)(request_1.requestValidation.createRequest), request_1.requestController.createRequest);
router
    .route('/:RequestId')
    .get((0, auth_1.auth)(), (0, validate_1.validate)(request_1.requestValidation.getRequest), request_1.requestController.getRequest)
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(request_1.requestValidation.updateRequest), request_1.requestController.updateRequest)
    .delete((0, auth_1.auth)(), (0, validate_1.validate)(request_1.requestValidation.deleteRequest), request_1.requestController.deleteRequest);
router
    .route('/:RequestId/accept')
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(request_1.requestValidation.acceptRequest), request_1.requestController.acceptRequest);
router
    .route('/:RequestId/decline')
    .patch((0, auth_1.auth)(), (0, validate_1.validate)(request_1.requestValidation.declineRequest), request_1.requestController.declineRequest);
exports.default = router;
