import mongoose from 'mongoose';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import { NewCreatedPayout, UpdatePayoutBody, IPayoutDoc } from './payout.interface';
import { userModel, userInterfaces, userService } from '../user';
import { eventModel, eventService } from '../event';
import payoutModel from './payout.model';
import { sendMail } from '../utils/sendMail';
import { ticketModel } from '../ticket';

const isDateTimeGreaterThanCurrent = (dateTime: Date): boolean => {
    const currentDateTime = new Date();
    return dateTime > currentDateTime;
}



/**
 * Create Payout
 * @param { NewCreatedPayout } PayoutBody
 * @returns { Promis<IPayoutDoc | null> }
 */
export const createPayout = async (PayoutBody: NewCreatedPayout): Promise<any | null> => {
    const check = await payoutModel.findOne({ organizerId: PayoutBody.organizerId, eventId: PayoutBody.eventId }) as any;
    const event = await eventModel.findById(PayoutBody.eventId) as any;
    if(check){
        throw new ApiError(httpStatus.FORBIDDEN, `You already requested for payout at ${new Date(check.createdAt as any).toISOString()}`)
    } else if(event.isEnded === false){
        throw new ApiError(httpStatus.FORBIDDEN, "You can't request for payout until after the event");
    } else {
        const Payout = await payoutModel.create(PayoutBody) as any;
        const event = await eventService.getEventById(PayoutBody.eventId as any);
        const user = await userService.getUserById(PayoutBody.organizerId as any)
        sendMail(user?.email as any, `You've requested Payout for ${event?.title} - Trietix`, { eventName: event?.title, organizerName: user?.name, accountName: user?.accountName, accountBank: user?.bank, payoutTime: Payout?.createdAt }, "organizer/payout.hbs")
        sendMail("trietixhq@gmail.com", `${user?.name} requested Payout for ${event?.title} - Trietix`, { eventName: event?.title, organizerName: user?.name, accountName: user?.accountName, accountBank: user?.bank, payoutTime: Payout?.createdAt }, "guru/payout.hbs")
        return Payout;
    }
}

/**
 * Get Payout by Id
 * @param {mongoose.Types.ObjectId} PayouttId
 * @returns {Promise<IEventDoc | null>}
 */
export const getPayoutById = async(PayoutId: mongoose.Types.ObjectId): Promise<IPayoutDoc | null> => {
    const event = await payoutModel.findById(PayoutId);
    return event;
}


/**
 * Get all the Payouts
 * @returns {Promise<IPayoutDoc | null>}
 */
export const getAllPayouts = async ():Promise<any> => {
    const Payouts = await payoutModel.find();
    if(!Payouts){
        throw new ApiError(httpStatus.NOT_FOUND, 'No Payout available')
    }
    return Payouts; 
}

export const getAdminAllPayouts = async (): Promise<any> => {
    let events = await eventModel.find().sort({ createdAt: -1});
    let payouts = Promise.all(events.map(async (event: any)=>{
        let organizer = await userModel.findById(event.organizer);
        const tickets = await ticketModel.find({ event: event._id });
        let numOfTickets = tickets.reduce((acc, ticket) => acc + ticket.amount, 0);
        return{
            title: event.title,
            organizer: organizer?.name,
            isEnded: event.isEnded,
            processingFee: event.processingFee,
            price: event.price,
            numOfTicketsBought: numOfTickets,
            paystackFee: (((event.processingFee + event.price) * 0.015) + (event.price > 2500 ? 100 : 0)) * numOfTickets, 
            organizerFee: event.price * numOfTickets,
            platformFee: (event.processingFee - (((event.processingFee + event.price) * 0.015) + (event.price > 2500 ? 100 : 0))) * numOfTickets,
            account: {
                bankName: organizer?.bank,
                accountNumber: organizer?.accountNumber,
                acountName: organizer?.accountName,
            }
        }
    }));
    return payouts;
}

/**
 * Get all the Payouts for Organizer
 * @param {string} organizerId
 * @returns {Promise<IPayoutDoc | null>}
 */
export const getAllPayoutsByOrganizer = async (organizerId: string):Promise<any> => {
    const Payouts = await payoutModel.find({ organizerId: organizerId });
    if(!Payouts){
        throw new ApiError(httpStatus.NOT_FOUND, 'No Payouts available')
    }
    return Payouts; 
}

/**
 * Get all the Payouts according to the Events
 * @param {mongoose.types.ObjectId} eventId
 * @returns {Promise<IPayoutDoc | null>}
 */
export const getPayoutsByEvent = async (eventId: string):Promise<any> => {
    const Payouts = await payoutModel.find({ eventId: eventId });
    if(!Payouts){
        throw new ApiError(httpStatus.NOT_FOUND, 'No Payouts available')
    }
    return Payouts; 
}


/**
 * Update an Payout by id
 * @param {mongoose.Types.ObjectId} PayoutId
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
export const updatePayoutById = async(PayoutId: mongoose.Types.ObjectId, updateBody: UpdatePayoutBody): Promise<IPayoutDoc | null> => {
    const Payout = await getPayoutById(PayoutId);
    if (!Payout) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payout not found');
    }
    Object.assign(Payout, updateBody);
    await Payout.save();
    return Payout;
}

/**
 * Delete Payout by id
 * @param {mongoose.Types.ObjectId} PayoutId
 * @returns {Promise<any | null>}
 */
export const deletePayoutById = async (PayoutId: mongoose.Types.ObjectId): Promise<any | null> => {
    const Payout = await getPayoutById(PayoutId) as any;
    if (!Payout) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payout not found');
    } else {
        const user = await userModel.findOne({ email: Payout?.email }) as any;
        await payoutModel.findOneAndRemove({ _id: PayoutId })
        return Payout;
    }
};
