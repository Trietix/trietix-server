// import fs from 'fs';
// import path from 'path';
// import config from '../../config/config';
// import nodemailer from 'nodemailer';
// import handlebars from 'handlebars';
// import ApiError from '../errors/ApiError';

// export const sendMail = async (
//     email: string,
//     subject: string,
//     payload: Object,
//     template: string
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






import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const clientid = config.email.smtp.client_id;
const clientsecret = config.email.smtp.client_secret;
const refreshToken = config.email.smtp.google_refresh_token;
const user = config.email.smtp.google_user;

export async function sendEmail(to, subject, payload, html, calendar) {
  try {
    const myOAuth2Client = new OAuth2(
      clientid,
      clientsecret,
      "https://developers.google.com/oauthplayground",
    );

    myOAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const myAccessToken = myOAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        type: "OAuth2",
        user: user, //your gmail account you used to set the project up in google cloud console"
        clientId: clientid,
        clientSecret: clientsecret,
        refreshToken: refreshToken,
        accessToken: (await myAccessToken).token, //access token variable we defined earlier
      },
    });

    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.log("Error occurred verifying mail server.");
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const templateDirectory = path.join(process.cwd(), "src/templates");
    const source = fs.readFileSync(`${templateDirectory}/${template}`, 'utf-8');
    const compileTemplate = handlebars.compile(String(source));
    const message = {
        from : config.email.from,
        to: email,
        subject: subject,
        html: compileTemplate({...payload, year:year}),
    };
    console.log(message);

    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log("Error occurred. " + err?.message);
          reject(err);
        }
        console.log("Email sent successfully to: ", message.to);
        resolve(info);
      });
    });

    return info;
  } catch (error) {
    console.log(error);
    return error;
  }
}