import mongoose, { Model, Document } from 'mongoose';
export interface ITicket {
    email: string;
    amount: number;
    ticketId: string;
    price: number;
    processingFee: number;
    event: string;
    isCheckedIn: boolean;
    noOfCheckedIn: number;
    user: string;
}

export interface ITicketDoc extends ITicket, Document {}

export type UpdateTicketBody = Partial<ITicket>;

export type NewCreatedTicket = ITicket
