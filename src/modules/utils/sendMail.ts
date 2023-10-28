import fs from 'fs';
import path from 'path';
import config from '../../config/config';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import ApiError from '../errors/ApiError';

export const sendMail = async (
    email: string,
    subject: string,
    payload: Object,
    template: string
) => {
    const year = new Date().getFullYear();
    try{
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
            transporter.verify((error: any, success: unknown): void => {
                if(error){
                    reject(new ApiError(401, `Invalid credentials - ${error}`))
                    return;
                } else {
                    console.log('Mailing service is up');
                    resolve(success);
                }
            })
        })

        const templateDirectory = path.join(process.cwd(), "src/templates");
        const source = fs.readFileSync(`${templateDirectory}/${template}`, 'utf-8');
        const compileTemplate = handlebars.compile(String(source));
        const message = {
            from : config.email.from,
            to: email,
            subject: subject,
            html: compileTemplate({...payload, year:year}),
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(message, (err: any, info: any)=> {
                if(err){
                    reject(new ApiError(401, `Invalid credentials - ${err}`));
                } else {
                    console.log(`Mail sent: `, info?.message)
                    console.log(`Preview URL: `, nodemailer.getTestMessageUrl(info));
                    resolve(info)
                }
            })
        })

        return true;
    } catch (error){
        new ApiError(401, `Invalid credentials - ${error}`);
        return false;
    }
}