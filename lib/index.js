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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const logger_1 = __importDefault(require("./modules/logger/logger"));
const axios_1 = __importDefault(require("axios"));
let server;
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.mongoose.url).then(() => {
            logger_1.default.info('Connected to MongoDB...');
            server = app_1.default.listen(config_1.default.port, () => {
                logger_1.default.info(`Server listening on port ${config_1.default.port}`);
                // updateEvent()
            });
        });
    }
    catch (error) {
        setTimeout(connectToDB, 5000);
        logger_1.default.error(error.message);
    }
});
connectToDB();
setInterval(() => {
    console.log('Initiating scheduling...');
    axios_1.default.get(`https://dinner.nuesaabuad.ng/api/clean-up`)
        .then((res) => console.log(`Pinged: ${res.status}`))
        .catch((err) => console.log(`Error pinging server: ${err}`));
}, 10 * 60 * 1000);
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger_1.default.info('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    logger_1.default.error(error);
    exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
