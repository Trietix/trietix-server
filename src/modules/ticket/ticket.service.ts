import mongoose from 'mongoose';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import { NewCreatedTicket, UpdateTicketBody, ITicketDoc, ITicket } from './ticket.interface';
import { userModel } from '../user';
import { eventModel } from '../event';
import ticketModel from './ticket.model';
import { sendMail } from '../utils/sendMail';
import Config from '../../config/config';
import axios from 'axios';

/**
 * Create Ticket
 * @param { NewCreatedTicket } ticketBody
 * @returns { Promis<ITicketDoc | null> }
 */
const headers = {
    Authorization: `Bearer ${Config.paystack.liveSecretKey}`
}
export const createTicket = async (ticketBody: NewCreatedTicket): Promise<any> => {
    try {
        if(Config.env === "production"){
            const verification = await axios.get(`https://api.paystack.co/transaction/verify/${ticketBody.ticketId}`,  { headers })
            const verificationData = verification.data.data;
            if(verificationData.status === 'success'){
                const ticket = ticketModel.create(ticketBody);
                return ticket;
            }
        } else {
            const ticket = ticketModel.create(ticketBody);
            return ticket;
        } 
    } catch (err: any){
        console.log(err);
        throw(new ApiError(httpStatus.FORBIDDEN, `Forbidden`));
    }
    // const ticket = ticketModel.create(ticketBody);
    // return ticket;
}

export const paystackWebHook = async (payload: any) => {
    try {
        console.log(payload);
        // if(payload.event === "transfer.success"){
        //     // if(payload.data.recipient.metadata === "")
        //     let ticket = await ticketModel.findOne({ reference: payload.reference });
        //     if(!ticket){
        //         let ticket = await ticketModel.create({...payload.data.recipient.metadata, ticketId: payload.reference });
        //         sendMail(payload.data.recipient.metadata.email, `Ticket purchase successful [${payload.reference}] - Trietix`, { amount: payload.data.recipient.metadata.amount, url:`https://trietix.com/ticket/${payload.reference}`}, "user/ticket.hbs");
        //         return ticket
        //     } else {
        //         throw(new ApiError(httpStatus.FORBIDDEN, `Not a transfer.success event`));
        //     }
        // }
        // if(Config.env === "production"){
        //     const verification = await axios.get(`https://api.paystack.co/transaction/verify/${ticketBody.ticketId}`,  { headers })
        //     const verificationData = verification.data.data;
        //     if(verificationData.status === 'success'){
        //         const ticket = ticketModel.create(ticketBody);
        //         return ticket;
        //     }
        // } else {
        //     const ticket = ticketModel.create(ticketBody);
        //     return ticket;
        // } 
        // const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        // if (hash == req.headers['x-paystack-signature']) {
        // // Retrieve the request's body
        // const event = req.body;
        // // Do something with event  
        // }
        // res.send(200);
    } catch (err: any){
        console.log(err);
        throw(new ApiError(httpStatus.FORBIDDEN, `Forbidden`));
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
 * Get the revenue for a particular organizerId
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
export const getRevenueByOrganizer = async (organizerId: mongoose.Types.ObjectId):Promise<any> => {
    const events = await eventModel.find({ organizer: organizerId });
    const ticketsRevenue = [];
    for(const event of events){
        const tickets = await ticketModel.find({ event: event.id }) as any;
        for(const ticket of tickets){
            let moneyMade = ticket.price - (ticket.processingFee * ticket.amount);
            let dateCreated = new Date(ticket.createdAt).toISOString().slice(0, 10);
            ticketsRevenue.push({moneyMade, dateCreated});
        } 
    }
    return ticketsRevenue; 
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
    if(!ticket){
        throw new ApiError(httpStatus.NOT_FOUND, "Ticket not Found")
    } else {
        return [ticket, event];
    }
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
