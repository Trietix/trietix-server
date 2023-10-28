import mongoose from 'mongoose';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import { NewCreatedTicket, UpdateTicketBody, ITicketDoc, ITicket } from './ticket.interface';
import { userModel } from '../user';
import { eventModel } from '../event';
import ticketModel from './ticket.model';
import { sendMail } from '../utils/sendMail';

/**
 * Create Ticket
 * @param { NewCreatedTicket } ticketBody
 * @returns { Promis<ITicketDoc | null> }
 */
export const createTicket = async (ticketBody: NewCreatedTicket): Promise<ITicketDoc | null> => {
    const ticket = await ticketModel.create(ticketBody);
    try {
        return ticket;
    } catch(err){
        throw(new ApiError(httpStatus.NOT_FOUND, `Error- ${err}`));
    }
}

/**
 * Get all the tickets
 * @returns {Promise<ITicketDoc | null>}
 */
export const getTickets = async ():Promise<any> => {
    const tickets = await ticketModel.find();
    if(!tickets){
        throw new ApiError(httpStatus.NOT_FOUND, 'No ticket available')
    }
    return tickets; 
}


/**
 * Get all the tickets for a particular organizerId
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
export const getTicketsByOrganizer = async (organizerId: mongoose.Types.ObjectId):Promise<any> => {
    const tickets = await ticketModel.find({ organizer: organizerId });
    if(!tickets){
        throw new ApiError(httpStatus.NOT_FOUND, 'No tickets available')
    }
    return tickets; 
}

/**
 * Get all the tickets for a particular price
 * @param {mongoose.Types.ObjectId} price
 * @returns {Promise<ICommandDoc | null>}
 */
export const getTicketsByPrice = async (price: number):Promise<any> => {
    const tickets = await ticketModel.find({ price: price });
    if(!tickets){
        throw new ApiError(httpStatus.NOT_FOUND, 'No tickets available')
    }
    return tickets; 
}

/**
 * Get Ticket by Id
 * @param {mongoose.Types.ObjectId} ticketId
 * @returns {Promise<ITicketDoc | null>}
 */
export const getTicketById = async(ticketId: mongoose.Types.ObjectId): Promise<ITicketDoc | null> => {
    const ticket = await ticketModel.findById(ticketId);
    return ticket;
}

/**
 * Get Tickets by User
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ITicketDoc | null>}
 */
export const getTicketsByUser = async(userId: mongoose.Types.ObjectId): Promise<ITicketDoc[] | null> => {
    const tickets = await ticketModel.find({ user: userId });
    return tickets;
}

/**
 * Get Ticket by transactionId
 * @param {string} transactionId
 * @returns {Promise<ITicketDoc | null>}
 */
export const getTicketByTransactionId = async(transactionId: string): Promise<any | null> => {
    const ticket = await ticketModel.findOne({ ticketId: transactionId }) as any;
    const event = await eventModel.findById(ticket?.event as any);
    return [ticket, event];
}

/**
 * Get Tickets by Event
 * @param {any} ticketEvent
 * @returns {Promise<ITicketDoc | null>}
 */
export const getTicketsByEvent = async(ticketEvent: any): Promise<ITicketDoc[] | any> => {
    const tickets = await ticketModel.find({ event: ticketEvent })
    return tickets;
}

// /**
//  * Get Tickets Analytics by Event
//  * @param {any} ticketEvent
//  * @returns {Promise<ITicketDoc | null>}
//  */
// export const getTicketAnalyticsByEvent = async(ticketEvent: any): Promise<ITicketDoc[] | any> => {
//     const tickets = await ticketModel.find({ event: ticketEvent });
//     try {
//         const tiketSalesPerDay = await eventModel.aggregate([
//             {
//                 $match: { event: mongoose.Types.ObjectId(ticketEvent) }
//             },
//             {
//                 $unwind: ""
//             }
//         ])
//     } catch (err){
//         return err;
//     }
//     return tickets;
// }

/**
 * Update a ticket by id
 * @param {mongoose.Types.ObjectId} ticketId
 * @param {UpdateTicketBody} updateBody
 * @returns {Promise<ITicketDoc | null>}
 */
export const updateTicketById = async(ticketId: mongoose.Types.ObjectId, updateBody: UpdateTicketBody): Promise<ITicketDoc | null> => {
    const ticket = await getTicketById(ticketId);
    if (!ticket) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    }
    Object.assign(ticket, updateBody);
    await ticket.save();
    return ticket;
}


/**
 * Delete Ticket by id
 * @param {mongoose.Types.ObjectId} ticketId
 * @returns {Promise<IInstructorDoc | null>}
 */
export const deleteTicketById = async (ticketId: mongoose.Types.ObjectId): Promise<ITicketDoc | null> => {
    const ticket = await getTicketById(ticketId);
    if (!ticket) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    }
    const user = await userModel.findById(ticket.user);

    if(user?.tickets.includes(ticketId)){
        user?.tickets.splice(user?.tickets.indexOf(ticketId), 1);
        await user?.save();
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    }
    await ticketModel.findOneAndRemove({ _id: ticketId })
    return ticket;
};