import Joi from 'joi';
import 'dotenv/config';

interface EnvVars {
  NODE_ENV: 'production' | 'development' | 'test';
  PORT: number;
  MONGODB_URL: string;
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRATION_MINUTES: number;
  JWT_REFRESH_EXPIRATION_DAYS: number;
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: number;
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: number;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USERNAME?: string;
  SMTP_PASSWORD?: string;
  EMAIL_FROM?: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY : string;
  CLOUDINARY_API_SECRET: string;
  CLIENT_URL: string;
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: string;
  NEXT_SECRET_PAYSTACK_SECRET_KEY: string;
  NEXT_LIVE_SECRET_PAYSTACK_KEY: string;
  NEXT_LIVE_PUBLIC_PAYSTACK_KEY: string;
}

class Config {
  public readonly env: string;
  public readonly port: number;
  public readonly mongoose: {
    url: string;
    options: {
      useCreateIndex: boolean;
      useNewUrlParser: boolean;
      useUnifiedTopology: boolean;
    };
  };
  public readonly jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
    resetPasswordExpirationMinutes: number;
    verifyEmailExpirationMinutes: number;
    cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      signed: boolean;
    };
  };
  public readonly email: {
    smtp: {
      host?: string;
      port?: number;
      auth: {
        user?: string;
        pass?: string;
      };
    };
    from?: string;
  };
  public readonly cloudinary: {
    cloudName?: string;
    apiKey?: string;
    apiSecret: string;
  };
  public readonly clientUrl: string;
  public readonly paystack:{
    publicKey: string;
    secretKey: string;
    liveSecretKey: string;
    livePublicKey: string;
  }

  constructor(envVars: EnvVars) {
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
    }
    this.clientUrl = envVars.CLIENT_URL,
    this.paystack = {
      publicKey: envVars.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      secretKey: envVars.NEXT_SECRET_PAYSTACK_SECRET_KEY,
      liveSecretKey: envVars.NEXT_LIVE_SECRET_PAYSTACK_KEY,
      livePublicKey: envVars.NEXT_LIVE_PUBLIC_PAYSTACK_KEY
    };
  }
}

const envVarsSchema = Joi.object<EnvVars>()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    CLOUDINARY_CLOUD_NAME: Joi.string().description('The cloud_name used in cloudinary'),
    CLOUDINARY_API_KEY : Joi.string().description('Api key for cloudinary'),
    CLOUDINARY_API_SECRET: Joi.string().description('Api secret for cloudinary'),
    CLIENT_URL: Joi.string().required().description('Client url'),
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: Joi.string(),
    NEXT_SECRET_PAYSTACK_SECRET_KEY: Joi.string(),
    NEXT_LIVE_SECRET_PAYSTACK_KEY: Joi.string(),
    NEXT_LIVE_PUBLIC_PAYSTACK_KEY: Joi.string()
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = new Config(envVars);
export default config; 