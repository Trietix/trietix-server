import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as eventService from './event.service';
import * as inviteService from '../invites/invite.service';
import { v2 as cloudinary } from "cloudinary";
import Config from '../../config/config';

cloudinary.config({
  cloud_name: Config.cloudinary.cloudName,
  api_key: Config.cloudinary.apiKey,
  api_secret: Config.cloudinary.apiSecret,
});

export const createEvent =  catchAsync(async (req: Request, res: Response) => {
  const photoUrl = await cloudinary.uploader.upload(req.body.image);
    const event = await eventService.createEvent({ ...req.body, image: photoUrl.url });
    res.status(httpStatus.CREATED).send(event);
});

export const getEvent = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['eventId'] === 'string') {
      const event = await eventService.getEventById(new mongoose.Types.ObjectId(req.params['eventId']));
      if (!event) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
      }
      res.send(event);
    }
});

export const getEventByName = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['eventName'] === 'string') {
    const event = await eventService.getEventByTitle(req.params['eventName']);
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    res.send(event);
  }
});

export const getEvents = catchAsync(async (req: Request, res: Response)=>{
  const  events = await eventService.getEvents();
  res.status(httpStatus.OK).send(events);
})

export const getAllInvites = catchAsync(async (req: Request, res: Response)=>{
  const invites = await inviteService.getAllInvites();
  res.status(httpStatus.OK).send(invites);
});

export const getInvitesByEvent = catchAsync(async (req: Request, res: Response)=>{
  const invites =  await inviteService.getInvitesByEvent(req.body.eventId);
  res.status(httpStatus.OK).send(invites);
})

export const getEventsByOrganizer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['organizer'] === 'string') {
    const event = await eventService.getEventsByOrganizer(new mongoose.Types.ObjectId(req.params['organizer']));
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No events found');
    }
    res.send(event);
  }
});

export const getRecentEventByTopOrganizer = catchAsync(async(req: Request, res: Response)=>{
  const event = await eventService.getRecentEventByTopOrganizer();
  res.status(httpStatus.OK).send(event);
})

export const getTopEventsByOrganizer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['organizer'] === 'string') {
    const event = await eventService.getTopEventsByOrganizer(new mongoose.Types.ObjectId(req.params['organizer']));
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No events found');
    }
    res.send(event);
  }
});

export const getEventByOrganizer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['title'] === 'string') {
    const event = await eventService.getEventByOrganizer(req.params['title'], req.params['organizer'] as any);
    if (!event) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    res.send(event);
  }
});

export const getEventTicketsByOrganizer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['title'] === 'string') {
    const tickets = await eventService.getEventTicketsByOrganizer(req.params['title'], req.params['organizer'] as any);
    if (!tickets) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tickets not found');
    }
    res.send(tickets);
  }
});

export const getEventVolunteersByOrganizer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['title'] === 'string') {
      const volunteers = await eventService.getEventVolunteersByOrganizer(req.params['title'], req.params['organizer'] as any);
    if (!volunteers) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Volunteers not found');
    }
      res.send(volunteers);
    }
  }
);

export const getEventByTitle = catchAsync(async (req: Request, res: Response)=>{
  if (typeof req.params['title'] === 'string') {
      const event = await eventService.getEvent(req.params['title']);
      if (!event) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
      }
      res.send(event);
    }
})
  
export const updateEvent = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['eventId'] === 'string') {
      const event = await eventService.updateEventById(new mongoose.Types.ObjectId(req.params['eventId']), req.body);
      res.send(event);
    }
});

export const updateEventByName = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['eventName'] === 'string') {
    const event = await eventService.updateEventByName(req.params['eventName'], req.body);
    res.send(event);
  }
});
  
export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['eventId'] === 'string') {
      await eventService.deleteEventById(new mongoose.Types.ObjectId(req.params['eventId']));
      res.status(httpStatus.NO_CONTENT).send();
    }
});
  
export const deleteEventByName = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['eventName'] === 'string') {
    await eventService.deleteEventByName(req.params['eventName']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});