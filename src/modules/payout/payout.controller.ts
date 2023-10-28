import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import { sendMail } from '../utils/sendMail'; 
import * as PayoutService from './payout.service';
import { eventService } from '../event';
import { userService } from '../user';
import mongoose from 'mongoose';

export const createPayout =  catchAsync(async (req: Request, res: Response) => {
    const Payout = await PayoutService.createPayout(req.body);
    const event = await eventService.getEventById(req.body.eventId);
    const user = await userService.getUserById(req.body?.organizerId as any)
    sendMail(user?.email as any, `You've requested Payout for ${event?.title} - Trietix`, { eventName: event?.title, organizerName: user?.name, accountName: user?.accountName, accountBank: user?.bank, payoutTime: Payout?.createdAt }, "organizer/payout.hbs")
    sendMail("trietixhq@gmail.com", `${user?.name} requested Payout for ${event?.title} - Trietix`, { eventName: event?.title, organizerName: user?.name, accountName: user?.accountName, accountBank: user?.bank, payoutTime: Payout?.createdAt }, "guru/payout.hbs")
    res.status(httpStatus.CREATED).send(Payout);
});

export const getAllPayouts = catchAsync(async (req: Request, res: Response) => {
    const Payout = await PayoutService.getAllPayouts();
      if (!Payout) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payouts not found');
      }
      res.send(Payout);
});

export const getPayoutsByOrganizer = catchAsync(async (req: Request, res: Response) => {
    const PayoutS = await PayoutService.getAllPayoutsByOrganizer(req.params['organizerId']);
      if (!PayoutS) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payouts not found');
      }
      res.send(PayoutS);
});

export const getPayoutsByEvent = catchAsync(async (req: Request, res: Response) => {
    const PayoutS = await PayoutService.getPayoutsByEvent(req.params['eventId']);
      if (!PayoutS) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payouts not found');
      }
      res.send(PayoutS);
});

export const getPayout = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['PayoutId'] === 'string') {
      const Payout = await PayoutService.getPayoutById(new mongoose.Types.ObjectId(req.params['PayoutId']));
      if (!Payout) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payout not found');
      }
      res.send(Payout);
    }
});

export const updatePayout = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['PayoutId'] === 'string') {
      const Payout = await PayoutService.updatePayoutById(new mongoose.Types.ObjectId(req.params['PayoutId']), req.body);
      res.send(Payout);
    }
});

export const deletePayout = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['PayoutId'] === 'string') {
      await PayoutService.deletePayoutById(new mongoose.Types.ObjectId(req.params['PayoutId']));
      res.status(httpStatus.NO_CONTENT).send();
    }
});