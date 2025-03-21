"use strict";
// import fs from 'fs';
// import path from 'path';
// import config from '../../config/config';
// import nodemailer from 'nodemailer';
// import handlebars from 'handlebars';
// import ApiError from '../errors/ApiError';
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
exports.removeDuplicateEmails = exports.sendMail = void 0;
// export const sendMail = async (
// email: string,
// subject: string,
// payload: Object,
// template: string
// ) => {
//     const year = new Date().getFullYear();
//     console.log(email)
//     try{
//         const transporter = nodemailer.createTransport({
//             host: config.email.smtp.host,
//             port: config.email.smtp.port,
//             secure: false,
//             auth: {
//                 user: config.email.smtp.auth.user,
//                 pass: config.email.smtp.auth.pass,
//             }
//         })
//         await new Promise((resolve, reject) => {
//             transporter.verify((error: any, success: unknown): void => {
//                 if(error){
//                     reject(new ApiError(401, `Invalid credentials - ${error}`))
//                     return;
//                 } else {
//                     console.log('Mailing service is up');
//                     resolve(success);
//                 }
//             })
//         })
//         const templateDirectory = path.join(process.cwd(), "src/templates");
//         const source = fs.readFileSync(`${templateDirectory}/${template}`, 'utf-8');
//         const compileTemplate = handlebars.compile(String(source));
//         const message = {
//             from : config.email.from,
//             to: email,
//             subject: subject,
//             html: compileTemplate({...payload, year:year}),
//         };
//         console.log(message);
//         await new Promise((resolve, reject) => {
//             transporter.sendMail(message, (err: any, info: any)=> {
//                 if(err){
//                     reject(new ApiError(401, `Invalid credentials - ${err}`));
//                 } else {
//                     console.log(`Mail sent: `, info?.message)
//                     console.log(`Preview URL: `, nodemailer.getTestMessageUrl(info));
//                     resolve(info)
//                 }
//             })
//         })
//         return true;
//     } catch (error){
//         new ApiError(401, `Invalid credentials - ${error}`);
//         return false;
//     }
// }
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const config_1 = __importDefault(require("../../config/config"));
const OAuth2 = googleapis_1.google.auth.OAuth2;
const clientid = config_1.default.email.smtp.client_id;
const clientsecret = config_1.default.email.smtp.client_secret;
const refreshToken = config_1.default.email.smtp.google_refresh_token;
const user = config_1.default.email.smtp.google_user;
function sendMail(to, subject, payload, html, blast, mails, startIndex, calendar) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const year = new Date().getFullYear();
            // const myOAuth2Client = new OAuth2(
            //   clientid,
            //   clientsecret,
            //   "https://developers.google.com/oauthplayground",
            // );
            // myOAuth2Client.setCredentials({
            //   refresh_token: refreshToken,
            // });
            // const myAccessToken = myOAuth2Client.getAccessToken();
            // const transporter = nodemailer.createTransport({
            // // @ts-ignore
            //   service: "gmail",
            //   secure: false,
            //   auth: {
            //     type: "OAuth2",
            //     user: user, //your gmail account you used to set the project up in google cloud console"
            //     clientId: clientid,
            //     clientSecret: clientsecret,
            //     refreshToken: refreshToken,
            //     accessToken: (await myAccessToken).token, //access token variable we defined earlier
            //   },
            // });
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
                        console.log("Error occurred verifying mail server.");
                        reject(error);
                    }
                    else {
                        console.log("Server is ready to take our messages");
                        resolve(success);
                    }
                });
            });
            const templateDirectory = path_1.default.join(process.cwd(), "src/templates");
            const source = fs_1.default.readFileSync(`${templateDirectory}/${html}`, 'utf-8');
            const compileTemplate = handlebars_1.default.compile(String(source));
            const message = {
                from: config_1.default.email.from,
                to: to,
                subject: subject,
                html: compileTemplate(Object.assign(Object.assign({}, payload), { year: year })),
            };
            let batchSize = 50;
            if (blast === true) {
                // @ts-ignore
                for (let i = startIndex; i < mails.length; i += batchSize) {
                    // @ts-ignore
                    const batch = mails.slice(i, i + batchSize);
                    const message = {
                        from: config_1.default.email.from,
                        to: batch.join(','),
                        subject: subject,
                        html: compileTemplate(Object.assign(Object.assign({}, payload), { year: year })),
                    };
                    try {
                        const info = yield new Promise((resolve, reject) => {
                            transporter.sendMail(message, (err, info) => {
                                if (err) {
                                    console.log("Error occurred. " + (err === null || err === void 0 ? void 0 : err.message));
                                    reject(err);
                                }
                                console.log("Email sent successfully to: ", message.to);
                                resolve(info);
                            });
                        });
                        // @ts-ignore
                        console.log(`Batch ${i / batchSize + 1}: Emails sent successfully to ${batch.length} users.`);
                    }
                    catch (error) {
                        console.error("Error sending emails:", error);
                    }
                    // Delay between batches to prevent rate-limiting
                    yield new Promise((resolve) => setTimeout(resolve, 2000));
                }
                console.log("All emails have been sent.");
                return "All mails sent successfully";
            }
            else {
                const info = yield new Promise((resolve, reject) => {
                    // @ts-ignore
                    transporter.sendMail(message, (err, info) => {
                        if (err) {
                            console.log("Error occurred. " + (err === null || err === void 0 ? void 0 : err.message));
                            reject(err);
                        }
                        console.log("Email sent successfully to: ", message.to);
                        resolve(info);
                    });
                });
                return info;
            }
        }
        catch (error) {
            console.log(error);
            return error;
        }
    });
}
exports.sendMail = sendMail;
const removeDuplicateEmails = (data) => {
    const uniqueEmails = new Set(data.map(item => item.email));
    return Array.from(uniqueEmails);
};
exports.removeDuplicateEmails = removeDuplicateEmails;
