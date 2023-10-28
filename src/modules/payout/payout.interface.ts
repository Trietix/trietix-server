import mongoose, { Model, Document } from 'mongoose';
export interface IPayout {
    organizerId: string;
    eventId: string;
    status: string;
}

export interface IPayoutDoc extends IPayout, Document {}

export type UpdatePayoutBody = Partial<IPayout>;

export type NewCreatedPayout = IPayout