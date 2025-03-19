import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Token from '../token/token.model';
import ApiError from '../errors/ApiError';
import { sendMail } from '../utils/sendMail';
import tokenTypes from '../token/token.types';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById, updateUserById } from '../user/user.service';
import { IUserDoc, IUserWithTokens } from '../user/user.interfaces';
import { generateAuthTokens, verifyToken, generateResetPasswordToken } from '../token/token.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */ 
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  console.log(refreshToken)
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error: any) {
    throw new ApiError(httpStatus.FORBIDDEN, error);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    let user  = await getUserByEmail(email);
    if(user){
      let resetToken = await generateResetPasswordToken(email);
      if(user.bank){
        sendMail(email, "Reset your Trietix password", { resetToken: resetToken, email: email }, "user/reset-password.hbs")
      } else {
        sendMail(email, "Reset your Trietix password - Organizer", { resetToken: resetToken, email: email }, "organizer/reset-passwor.hbs")
      }
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You don't have an account!")
    }
  } catch (error: any){
    throw new ApiError(httpStatus.FORBIDDEN, error)
  }
}

export const resetPassword = async (resetToken: string, password: string) => {
  try {
    const resetTokenDoc = await verifyToken(resetToken, tokenTypes.RESET_PASSWORD);
    let newPassword =  await bcrypt.hash(password, 8)
    let user = await updateUserById(new mongoose.Types.ObjectId(resetTokenDoc.user), { password: newPassword })
    if(!user){
      throw new Error();
    };
    await Token.deleteOne({ token: resetToken });
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch(error: any){
    throw new ApiError(httpStatus.FORBIDDEN, error)
  }
}