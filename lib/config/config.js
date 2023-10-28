"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
require("dotenv/config");
class Config {
    constructor(envVars) {
        this.env = envVars.NODE_ENV;
        this.port = envVars.PORT;
        this.mongoose = {
            url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
            options: {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        };
        this.jwt = {
            secret: envVars.JWT_SECRET,
            accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
            refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
            resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
            verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
            cookieOptions: {
                httpOnly: true,
                secure: envVars.NODE_ENV === 'production',
                signed: true,
            },
        };
        this.email = {
            smtp: {
                host: envVars.SMTP_HOST,
                port: envVars.SMTP_PORT,
                auth: {
                    user: envVars.SMTP_USERNAME,
                    pass: envVars.SMTP_PASSWORD,
                },
            },
            from: envVars.EMAIL_FROM,
        };
        this.cloudinary = {
            cloudName: envVars.CLOUDINARY_CLOUD_NAME,
            apiKey: envVars.CLOUDINARY_API_KEY,
            apiSecret: envVars.CLOUDINARY_API_SECRET,
        };
        this.clientUrl = envVars.CLIENT_URL;
    }
}
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid('production', 'development', 'test').required(),
    PORT: joi_1.default.number().default(3000),
    MONGODB_URL: joi_1.default.string().required().description('Mongo DB url'),
    JWT_SECRET: joi_1.default.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description('minutes after which verify email token expires'),
    SMTP_HOST: joi_1.default.string().description('server that will send the emails'),
    SMTP_PORT: joi_1.default.number().description('port to connect to the email server'),
    SMTP_USERNAME: joi_1.default.string().description('username for email server'),
    SMTP_PASSWORD: joi_1.default.string().description('password for email server'),
    EMAIL_FROM: joi_1.default.string().description('the from field in the emails sent by the app'),
    CLOUDINARY_CLOUD_NAME: joi_1.default.string().description('The cloud_name used in cloudinary'),
    CLOUDINARY_API_KEY: joi_1.default.string().description('Api key for cloudinary'),
    CLOUDINARY_API_SECRET: joi_1.default.string().description('Api secret for cloudinary'),
    CLIENT_URL: joi_1.default.string().required().description('Client url'),
})
    .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const config = new Config(envVars);
exports.default = config;
