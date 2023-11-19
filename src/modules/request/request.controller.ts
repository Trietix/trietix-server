import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as RequestService from './request.service';
import * as userService from '../user/user.service';
import mongoose from 'mongoose';
import { v2 as cloudinary } from "cloudinary";
import Config from '../../config/config';

cloudinary.config({
  cloud_name: Config.cloudinary.cloudName,
  api_key: Config.cloudinary.apiKey,
  api_secret: Config.cloudinary.apiSecret,
});

export const createRequest =  catchAsync(async (req: Request, res: Response) => {
    const presidentId = await cloudinary.uploader.upload(req.body.presidentId);
    const Request = await RequestService.createRequest({ ...req.body, presidentId: presidentId.url });
    res.status(httpStatus.CREATED).send(Request);
});

export const getAllRequests = catchAsync(async (req: Request, res: Response) => {
    const Request = await RequestService.getAllRequests();
      if (!Request) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Requests not found');
      }
      res.send(Request);
});

export const getRequestsByOrganizer = catchAsync(async (req: Request, res: Response) => {
    const RequestS = await RequestService.getAllRequestsByOrganizer(req.params['organizerId']);
      if (!RequestS) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Requests not found');
      }
      res.send(RequestS);
});

export const getRequest = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['RequestId'] === 'string') {
      const Request = await RequestService.getRequestById(new mongoose.Types.ObjectId(req.params['RequestId']));
      if (!Request) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
      }
      res.send(Request);
    }
});

export const acceptRequest = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['RequestId'] === 'string') {
    const Request = await RequestService.updateRequestById(new mongoose.Types.ObjectId(req.params['RequestId']), { status: "accepted" });
    const user = userService.updateUserById(new mongoose.Types.ObjectId(Request?.organizerId as any), { isVerified: true });
    res.send([Request, user])
  }
})

export const declineRequest = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['RequestId'] === 'string') {
    const Request = await RequestService.updateRequestById(new mongoose.Types.ObjectId(req.params['RequestId']), { status: "declined" });
    res.send(Request);
  }
})

export const updateRequest = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['RequestId'] === 'string') {
      const Request = await RequestService.updateRequestById(new mongoose.Types.ObjectId(req.params['RequestId']), req.body);
      res.send(Request);
    }
});

export const deleteRequest = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['RequestId'] === 'string') {
      await RequestService.deleteRequestById(new mongoose.Types.ObjectId(req.params['RequestId']));
      res.status(httpStatus.NO_CONTENT).send();
    }
});