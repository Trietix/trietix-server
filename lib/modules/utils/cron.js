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
exports.updateEvent = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const event_1 = require("../event");
const updateEvent = () => __awaiter(void 0, void 0, void 0, function* () {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const eventsToUpdate = yield event_1.eventModel.find({ startDate: { $gte: twentyFourHoursAgo } });
    node_cron_1.default.schedule('* 1 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        // Update the events with started=true
        for (const event of eventsToUpdate) {
            event.started = true;
            yield event.save();
        }
    }));
    // Find events with a start date greater than or equal to 24 hours ago
    console.log(`Updated ${eventsToUpdate.length} events.`);
});
exports.updateEvent = updateEvent;
