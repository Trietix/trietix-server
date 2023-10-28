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
exports.sendMail = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config/config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const sendMail = (email, subject, payload, template) => __awaiter(void 0, void 0, void 0, function* () {
    const year = new Date().getFullYear();
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: config_1.default.email.smtp.host,
            port: config_1.default.email.smtp.port,
            secure: false,
            auth: {
                user: config_1.default.email.smtp.auth.user,
                pass: config_1.default.email.smtp.auth.pass,
            }
        });
        yield new Promise((resolve, reject) => {
            transporter.verify((error, success) => {
                if (error) {
                    reject(new ApiError_1.default(401, `Invalid credentials - ${error}`));
                    return;
                }
                else {
                    console.log('Mailing service is up');
                    resolve(success);
                }
            });
        });
        const templateDirectory = path_1.default.join(process.cwd(), "src/templates");
        const source = fs_1.default.readFileSync(`${templateDirectory}/${template}`, 'utf-8');
        const compileTemplate = handlebars_1.default.compile(String(source));
        const message = {
            from: config_1.default.email.from,
            to: email,
            subject: subject,
            html: compileTemplate(Object.assign(Object.assign({}, payload), { year: year })),
        };
        yield new Promise((resolve, reject) => {
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    reject(new ApiError_1.default(401, `Invalid credentials - ${err}`));
                }
                else {
                    console.log(`Mail sent: `, info === null || info === void 0 ? void 0 : info.message);
                    console.log(`Preview URL: `, nodemailer_1.default.getTestMessageUrl(info));
                    resolve(info);
                }
            });
        });
        return true;
    }
    catch (error) {
        new ApiError_1.default(401, `Invalid credentials - ${error}`);
        return false;
    }
});
exports.sendMail = sendMail;
