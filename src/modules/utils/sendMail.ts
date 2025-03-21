// import fs from 'fs';
// import path from 'path';
// import config from '../../config/config';
// import nodemailer from 'nodemailer';
// import handlebars from 'handlebars';
// import ApiError from '../errors/ApiError';

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






import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import config from '../../config/config';

const OAuth2 = google.auth.OAuth2;

const clientid = config.email.smtp.client_id;
const clientsecret = config.email.smtp.client_secret;
const refreshToken = config.email.smtp.google_refresh_token;
const user = config.email.smtp.google_user;

export async function sendMail(to: string | null, subject: string, payload: Object, html: string, blast?: boolean, mails?: string[], startIndex?: number, calendar?: any) {
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

    const transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: false,
      auth: {
          user: config.email.smtp.auth.user,
          pass: config.email.smtp.auth.pass,
      }
  })

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
    const source = fs.readFileSync(`${templateDirectory}/${html}`, 'utf-8');
    const compileTemplate = handlebars.compile(String(source));
    const message = {
        from : config.email.from,
        to: to,
        subject: subject,
        html: compileTemplate({...payload, year: year}),
    };
     let batchSize = 50;
    if(blast === true){
      // @ts-ignore
      for (let i = startIndex; i < mails.length; i += batchSize) {
        // @ts-ignore
          const batch = mails.slice(i, i + batchSize);
          const message = {
            from : config.email.from,
            to: batch.join(','),
            subject: subject,
            html: compileTemplate({...payload, year: year }),
          };
          try {
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
              // @ts-ignore
              console.log(`Batch ${i / batchSize + 1}: Emails sent successfully to ${batch.length} users.`);
          } catch (error) {
              console.error("Error sending emails:", error);
          }
  
          // Delay between batches to prevent rate-limiting
          await new Promise((resolve) => setTimeout(resolve, 2000));
      }
  
        console.log("All emails have been sent.");
        return "All mails sent successfully"
    } else {
      const info = await new Promise((resolve, reject) => {
        // @ts-ignore
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
    }


  } catch (error) {
    console.log(error);
    return error;
  }
}

export const removeDuplicateEmails = (data: { _id: string; email: string }[]) => {
  const uniqueEmails = new Set(data.map(item => item.email));
  return Array.from(uniqueEmails);
};
