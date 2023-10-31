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
exports.deletePayout = exports.updatePayout = exports.getPayout = exports.getPayoutsByEvent = exports.getPayoutsByOrganizer = exports.getAllPayouts = exports.createPayout = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const PayoutService = __importStar(require("./payout.service"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.createPayout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Payout = yield PayoutService.createPayout(req.body);
    res.status(http_status_1.default.CREATED).send(Payout);
}));
exports.getAllPayouts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Payout = yield PayoutService.getAllPayouts();
    if (!Payout) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Payouts not found');
    }
    res.send(Payout);
}));
exports.getPayoutsByOrganizer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const PayoutS = yield PayoutService.getAllPayoutsByOrganizer(req.params['organizerId']);
    if (!PayoutS) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Payouts not found');
    }
    res.send(PayoutS);
}));
exports.getPayoutsByEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const PayoutS = yield PayoutService.getPayoutsByEvent(req.params['eventId']);
    if (!PayoutS) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Payouts not found');
    }
    res.send(PayoutS);
}));
exports.getPayout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['PayoutId'] === 'string') {
        const Payout = yield PayoutService.getPayoutById(new mongoose_1.default.Types.ObjectId(req.params['PayoutId']));
        if (!Payout) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Payout not found');
        }
        res.send(Payout);
    }
}));
exports.updatePayout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['PayoutId'] === 'string') {
        const Payout = yield PayoutService.updatePayoutById(new mongoose_1.default.Types.ObjectId(req.params['PayoutId']), req.body);
        res.send(Payout);
    }
}));
exports.deletePayout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params['PayoutId'] === 'string') {
        yield PayoutService.deletePayoutById(new mongoose_1.default.Types.ObjectId(req.params['PayoutId']));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
