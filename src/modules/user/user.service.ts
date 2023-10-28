import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from '../errors';
import { userModel } from '../user';
import { inviteModel } from '../invites';
import { UpdateUserBody, IUserDoc, NewRegisteredUser } from './user.interfaces';
import { v2 as cloudinary } from "cloudinary";
import Config from '../../config/config';

cloudinary.config({
  cloud_name: Config.cloudinary.cloudName,
  api_key: Config.cloudinary.apiKey,
  api_secret: Config.cloudinary.apiSecret,
});

const isEmailTaken = async(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean> => {
    const user = await userModel.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
}

/**
 * Register as user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc| null>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
    if (await isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    } else {
      const { photo } = userBody;
      let pattern = /api\.dicebear\.com/;
      let photoUrl;
      let mainUrl;
      if(pattern.test(photo)){
        photoUrl = photo;
      } else {
        mainUrl = await cloudinary.uploader.upload(photo);
      }
      const newUser = await userModel.create({
        ...userBody,
        photo: mainUrl ? mainUrl.url : photoUrl,
      });
      return newUser;
    }
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => userModel.findById(id);

  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<IUserDoc | null>}
   */
  export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => userModel.findOne({ email });
  

/**
 * Get all users
 * @returns {Promis<IUserDoc[] | null>}
 */
export const getAllUsers = async(): Promise<IUserDoc[] | null> =>{
  const users = await userModel.find();
  return users;
};

/**
 * Get all organizers
 * @returns {Promis<IUserDoc[] | null>}
 */
export const getAllOrganizers = async(): Promise<IUserDoc[] | null> =>{
  const users = await userModel.find({ role: 'organizer' });
  return users;
};

/**
 * Get all the invitations
 * @param {mongoose.Types.ObjectId} email
 * @returns {Promise<IInviteDoc | null>}
 */
export const getAllInvitations = async (email: string):Promise<any> => {
  const invites = await inviteModel.find({ email: email });
  if(!invites){
      throw new ApiError(httpStatus.NOT_FOUND, 'No invitations available')
  }
  return invites; 
}

/**
 * Get all top organizers
 * @returns {Promis<IUserDoc[] | null>}
 */
export const getTopOrganizers = async(): Promise<IUserDoc[] | null> =>{
  const users = await userModel.find({ role: 'organizer' }).sort({ events: -1 }).limit(3);
  return users;
};

/**
 * Get recent organizers
 * @returns {Promis<IUserDoc[] | null>}
 */
export const getRecentOrganizers = async(): Promise<IUserDoc[] | null> =>{
  const users = await userModel.find({ role: 'organizer' }).sort({ createdAt: -1 }).limit(3);
  return users;
};

  /**
   * Update user by id
   * @param {mongoose.Types.ObjectId} userId
   * @param {UpdateUserBody} updateBody
   * @returns {Promise<IUserDoc | null>}
   */
  export const updateUserById = async (
    userId: mongoose.Types.ObjectId,
    updateBody: UpdateUserBody
  ): Promise<IUserDoc | null> => {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    } else {
      let pattern = /api\.dicebear\.com/;
      let mainUrl;
      let photoUrl;
      if(pattern.test(updateBody.photo as any)){
        photoUrl = updateBody.photo;
      } else {
        mainUrl = await cloudinary.uploader.upload(updateBody.photo as any);
      }
      Object.assign(user, { ...updateBody, photo: mainUrl ? mainUrl.url : photoUrl });
      await user.save();
      return user;
    }
  };
  
  /**
   * Delete user by id
   * @param {mongoose.Types.ObjectId} userId
   * @returns {Promise<IUserDoc | null>}
   */
  export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await userModel.findOneAndRemove({ _id: userId })
    return user;
  };