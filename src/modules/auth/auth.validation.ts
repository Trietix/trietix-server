import Joi from 'joi';
import { password } from '../validate/custom.validation';
import { NewRegisteredUser } from '../user/user.interfaces';

const registerBody: Record<keyof NewRegisteredUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  username: Joi.string(),
  name: Joi.string().required(),
  photo: Joi.string(),
  tickets: Joi.any(),
  events: Joi.any(),
  eventsAttended: Joi.string(),
  role: Joi.string(),
  eventsPaid: Joi.string(),
  volunteer: Joi.string(),
  isVerified: Joi.boolean(),
  phoneNumber: Joi.string(),
  accountNumber: Joi.number(),
  accountName: Joi.string(),
  invitations: Joi.array(),
  bank: Joi.string()
};

export const register = {
  body: Joi.object().keys(registerBody),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
