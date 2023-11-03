import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as ticketService from './ticket.service';
import { sendMail } from '../utils/sendMail';

export const createTicket =  catchAsync(async (req: Request, res: Response) => {
    const ticket = await ticketService.createTicket(req.body);
    sendMail(req.body.email, `Ticket purchase successful [${req.body.ticketId}] - Trietix`, { amount: req.body.amount, url:`https://trietix.com/ticket/${req.body.ticketId}`}, "user/ticket.hbs");
    res.status(httpStatus.CREATED).send(ticket);
});

export const getTicket = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['ticketId'] === 'string') {
      const ticket = await ticketService.getTicketById(new mongoose.Types.ObjectId(req.params['ticketId']));
      if (!ticket) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
      }
      res.send(ticket);
    }
});

export const getTickets = catchAsync(async (req: Request, res: Response)=>{
  const  tickets = await ticketService.getTickets();
  res.status(httpStatus.OK).send(tickets);
})

export const getTicketsByOrganizer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['organizer'] === 'string') {
    const ticket = await ticketService.getTicketsByOrganizer(new mongoose.Types.ObjectId(req.params['organizer']));
    if (!ticket) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No tickets found');
    }
    res.send(ticket);
  }
});

export const getRevenueByOrganizer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['organizer'] === 'string') {
    const revenue = await ticketService.getRevenueByOrganizer(new mongoose.Types.ObjectId(req.params['organizer']));
    if (!revenue) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No revenue');
    }
    res.send(revenue);
  }
});

export const getTicketsByUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const ticket = await ticketService.getTicketsByUser(new mongoose.Types.ObjectId(req.params['userId']));
    if (!ticket) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No tickets found');
    }
    res.send(ticket);
  }
});

export const getTicketByTransactionId = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['transactionId'] === 'string') {
    const ticket = await ticketService.getTicketByTransactionId((req.params['transactionId']));
    if (!ticket) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No ticket found');
    }
    res.send(ticket);
  }
});

export const getTicketsByPrice = catchAsync(async (req: Request, res: Response) => {
      const tickets = await ticketService.getTicketsByPrice(parseInt(req.params['ticketPrice']));
    if (!tickets) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tickets not found');
    }
      res.send(tickets);
    }
);
  
export const getTicketsByEvent = catchAsync(async (req: Request, res: Response) => {
      const tickets = await ticketService.getTicketsByEvent(req.params['eventId']);
    if (!tickets) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tickets not found');
    }
      res.send(tickets);
    }
);
  
export const updateTicket = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['ticketId'] === 'string') {
      const ticket = await ticketService.updateTicketById(new mongoose.Types.ObjectId(req.params['ticketId']), req.body);
      res.send(ticket);
    }
});
  
export const deleteTicket = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['ticketId'] === 'string') {
      await ticketService.deleteTicketById(new mongoose.Types.ObjectId(req.params['ticketId']));
      res.status(httpStatus.NO_CONTENT).send();
    }
});
