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
const updateEvent = () => {
    console.log('Started Cron Job');
    const job = node_cron_1.default.schedule(' */1 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        const currentTime = new Date().toISOString().slice(11, 16);
        const currentDate = new Date().toISOString().slice(0, 10);
        let eventsStarted = 0;
        let eventsEnded = 0;
        const eventsToStart = yield event_1.eventModel.find({
            startTime: { $lte: currentTime },
            date: { $gte: currentDate },
            isStarted: false,
        });
        eventsToStart.forEach((event) => __awaiter(void 0, void 0, void 0, function* () {
            event.isStarted = true;
            eventsStarted++;
            yield event.save();
        }));
        console.log(`Started ${eventsStarted} events`);
        const eventsToEnd = yield event_1.eventModel.find({
            endTime: { $gte: currentTime },
            date: { $lte: currentDate },
            isStarted: true,
            isEnded: false
        });
        eventsToEnd.forEach((event) => __awaiter(void 0, void 0, void 0, function* () {
            event.isEnded = true;
            eventsEnded++;
            yield event.save();
        }));
        console.log(`Ended ${eventsEnded} events`);
    }), {
        scheduled: true,
        timezone: 'Africa/Lagos'
    });
    job.start();
};
exports.updateEvent = updateEvent;
