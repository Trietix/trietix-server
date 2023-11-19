import mongoose, { Model, Document } from 'mongoose';
export interface IRequest {
    reason: string;
    nin: string;
    driverLicense: string;
    universityName: string;
    associationName: string;
    presidentId: string;
    organizerId: string;
    type: string;
    status: string;
}

export interface IRequestDoc extends IRequest, Document {}

export type UpdateRequestBody = Partial<IRequest>;

export type NewCreatedRequest = IRequest