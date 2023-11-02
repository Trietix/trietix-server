import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import { sendMail } from '../utils/sendMail'; 
import * as inviteService from './invite.service';
import { eventService } from '../event';
import { userService } from '../user';
import mongoose from 'mongoose';

export const createInvite =  catchAsync(async (req: Request, res: Response) => {
    const invite = await inviteService.createInvite(req.body);
    const event = await eventService.getEventById(req.body.eventId);
    const user = await userService.getUserById(event?.organizer as any)
    sendMail(req.body.email, "You've been invited as a volunteer - Trietix", { oraganizer: user?.name, eventTitle: event?.title, eventVenue: event?.venue, eventDate: event?.date, eventLocation: event?.location, eventTime: event?.startTime, url: `https://trietix.vercel.app/invites/${invite?.id}` }, "user/invite.hbs")
    res.status(httpStatus.CREATED).send(invite);
});

export const getAllInvites = catchAsync(async (req: Request, res: Response) => {
    const invite = await inviteService.getAllInvites();
      if (!invite) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invites not found');
      }
      res.send(invite);
});

export const getInvitesByUser = catchAsync(async (req: Request, res: Response) => {
    const invites = await inviteService.getAllInvitesByUser(req.params['email']);
      if (!invites) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invites not found');
      }
      res.send(invites);
});

export const getInvitesByEvent = catchAsync(async (req: Request, res: Response) => {
    const invites = await inviteService.getInvitesByEvent(req.params['eventId']);
      if (!invites) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invites not found');
      }
      res.send(invites);
});

export const getInvite = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['inviteId'] === 'string') {
      const invite = await inviteService.getInviteById(new mongoose.Types.ObjectId(req.params['inviteId']));
      if (!invite) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
      }
      res.send(invite);
    }
});

export const updateInvite = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['inviteId'] === 'string') {
      const invite = await inviteService.updateInviteById(new mongoose.Types.ObjectId(req.params['inviteId']), req.body);
      res.send(invite);
    }
});

export const deleteInvite = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['inviteId'] === 'string') {
      await inviteService.deleteInviteById(new mongoose.Types.ObjectId(req.params['inviteId']));
      res.status(httpStatus.NO_CONTENT).send();
    }
});