import mongoose, { Model, Document } from 'mongoose';
export interface IEvent {
    title: string;
    description: string;
    location: string;
    color: string;
    venue: string;
    price: number;
    startTime: string;
    endTime: string;
    invites: string[],
    date: string;
    processingFee: number;
    tickets: string[];
    organizer: string;
    image: string;
    socials: string[];
    isStarted: boolean;
    isEnded: boolean;
    isCancelled: boolean;
    checkedIn: string[];
    category: string[];
}

export interface IEventDoc extends IEvent, Document {}

export type UpdateEventBody = Partial<IEvent>;

export type NewCreatedEvent = IEvent