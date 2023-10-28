import mongoose, { Model, Document } from 'mongoose';
export interface IInvite {
    email: string;
    eventId: string;
    status: string;
}

export interface IInviteDoc extends IInvite, Document {}

export type UpdateInviteBody = Partial<IInvite>;

export type NewCreatedInvite = IInvite