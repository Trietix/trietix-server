import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as userService from './user.service';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser({...req.body, username: req.body.email.match(/.*?(?=@)/)});
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(httpStatus.FOUND).send(users);
});

export const getAllInvitations = catchAsync(async (req: Request, res: Response) => {
  const invitations = await userService.getAllInvitations(req.body.email);
  res.status(httpStatus.FOUND).send(invitations);
});

export const getOrganizers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllOrganizers();
  res.status(httpStatus.FOUND).send(users);
});

export const getTopOrganizers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getTopOrganizers();
  res.status(httpStatus.FOUND).send(users);
});

export const getRecentOrganizers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getRecentOrganizers();
  res.status(httpStatus.FOUND).send(users);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
});

export const getMe = catchAsync(async (req: Request, res: Response)=>{
  const user = req.user;
  if(!user){
    res.status(httpStatus.NOT_FOUND)
  }
  res.status(httpStatus.OK).send(user);
})

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    // let photoUrl;
    // if(req.body.photo){
    //   photoUrl = req.body.photo;
    // } else {
    //   photoUrl = await cloudinary.uploader.upload(req.body.photo);
    // }
    // ? { ...req.body, photo: photoUrl } : req.body
    const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']),  req.body );
    res.send(user);
  }
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['userId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
