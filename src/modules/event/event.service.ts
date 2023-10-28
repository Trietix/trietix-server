import mongoose from 'mongoose';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import { NewCreatedEvent, UpdateEventBody, IEventDoc } from './event.interface';
import { userModel } from '../user';
import { inviteModel } from '../invites';
import eventModel from './event.model';
import { ticketModel } from '../ticket';
const isEventNameTaken = async(title: string, excludeEventId?: mongoose.Types.ObjectId): Promise<boolean> => {
    const event = await eventModel.findOne({ title, _id: { $ne: excludeEventId } });
    return !!event;
}

/**
 * Create Event
 * @param { NewCreatedEvent } eventBody
 * @returns { Promis<IEventDoc | null> }
 */
export const createEvent = async (eventBody: NewCreatedEvent): Promise<IEventDoc | null> => {
    if(await isEventNameTaken(eventBody.title)){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken')
    }
    const event = await eventModel.create(eventBody)
    const user = await userModel.findById(eventBody.organizer)

    if(!user?.events.includes(event?.id)){
        user?.events.push(event?.id)
        await user?.save();
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event already exists');
    }
    return event;
}

/**
 * Get all the events
 * @returns {Promise<IEventDoc | null>}
 */
export const getEvents = async ():Promise<any> => {
    const events = await eventModel.find();
    if(!events){
        throw new ApiError(httpStatus.NOT_FOUND, 'No event available')
    }
    return events; 
}

/**
 * Get all the invites
 * @param {mongoose.Types.ObjectId} eventId
 * @returns {Promise<IInviteDoc | null>}
 */
export const getAllInvites = async (eventId: mongoose.Types.ObjectId):Promise<any> => {
    const invites = await inviteModel.find({ eventId: eventId });
    if(!invites){
        throw new ApiError(httpStatus.NOT_FOUND, 'No invite available')
    }
    return invites; 
}

/**
 * Get the top 3 events
 * @returns {Promise<IEventDoc | null>}
 */
export const getTopEvents = async ():Promise<any> => {
    const events = await eventModel.find().sort({ tickets: -1 }).limit(3);
    if(!events){
        throw new ApiError(httpStatus.NOT_FOUND, 'No event available')
    }
    return events; 
}

/**
 * Get the recent events
 * @returns {Promise<IEventDoc | null>}
 */
export const getRecentEvents = async ():Promise<any> => {
    const events = await eventModel.find().sort({ createdAt: -1 }).limit(3);
    if(!events){
        throw new ApiError(httpStatus.NOT_FOUND, 'No event available')
    }
    return events; 
}


/**
 * Get all the events for a particular userId
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
export const getEventsByOrganizer = async (organizerId: mongoose.Types.ObjectId):Promise<any> => {
    const events = await eventModel.find({ organizer: organizerId });
    if(!events){
        throw new ApiError(httpStatus.NOT_FOUND, 'No events available')
    }
    return events; 
}

/**
 * Get all the top events for a particular organizer
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
export const getTopEventsByOrganizer = async (organizerId: mongoose.Types.ObjectId):Promise<any> => {
    const events = await eventModel.find({ organizer: organizerId }).sort({ tickets: -1 }).limit(3);
    if(!events){
        throw new ApiError(httpStatus.NOT_FOUND, 'No events available')
    }
    return events; 
}

/**
 * Get all the recent events for a particular organizer
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
export const getRecentEventsByOrganizer = async (organizerId: mongoose.Types.ObjectId):Promise<any> => {
    const events = await eventModel.find({ organizer: organizerId }).sort({ createdAt: -1 }).limit(3);
    if(!events){
        throw new ApiError(httpStatus.NOT_FOUND, 'No events available')
    }
    return events; 
}

/**
 * Get the all event analytics for a particular organizer
 * @param {mongoose.Types.ObjectId} organizerId
 * @returns {Promise<ICommandDoc | null>}
 */
export const getEventAnalyticsByOrganizer = async (organizerId: mongoose.Types.ObjectId):Promise<any> => {
    const events = await eventModel.find({ organizer: organizerId });
    if(!events){
        throw new ApiError(httpStatus.NOT_FOUND, 'No events available');
    }
    try {
        const eventsPerMonth = await eventModel.aggregate([
            {
                $match: { organizer: new mongoose.Types.ObjectId(organizerId) }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    count: 1
                }
            },
            {
                $sort: { year: 1, month: 1 }
            }
        ]);
        return eventsPerMonth;
    } catch(err){
        return err;
    }
}


/**
 * Get Event by Id
 * @param {mongoose.Types.ObjectId} eventId
 * @returns {Promise<IEventDoc | null>}
 */
export const getEventById = async(eventId: mongoose.Types.ObjectId): Promise<IEventDoc | null> => {
    const event = await eventModel.findById(eventId);
    return event;
}

/**
 * Get Event by title
 * @param {string} eventTitle
 * @returns {Promise<IEventDoc | null>}
 */
export const getEventByTitle = async(eventTitle: string): Promise<IEventDoc | null> => {
    const event = await eventModel.findOne({ title: eventTitle.split('-').join(' ') });
    return event;
}

/**
 * Get Events tickets
 * @param {string} eventTitle
 * @returns {Promise<ITicketDoc | null>}
 */
export const getEventTickets = async(eventTitle: string): Promise<any> => {
    const event = await eventModel.findOne({ title: eventTitle.split('-').join(' ') });
    const tickets = await ticketModel.find({ event: event?._id });
    return tickets;
}

/**
 * Get Events volunteers
 * @param {string} eventTitle
 * @returns {Promise<IInviteDoc | null>}
 */
export const getEventVolunteers = async(eventTitle: string): Promise<any> => {
    const event = await eventModel.findOne({ title: eventTitle.split('-').join(' ') });
    const volunteers = await inviteModel.find({ eventId: event?._id });
    return volunteers;
}


/**
 * Get Events by Price
 * @param {number} eventPrice
 * @returns {Promise<IEventDoc | null>}
 */
export const getEventsByPrice = async(eventPrice: any): Promise<IEventDoc[] | any> => {
    const events = await eventModel.find({ price: eventPrice })
    return events;
}

/**
 * Get Events by Category
 * @param {number} eventCategory
 * @returns {Promise<IEventDoc | null>}
 */
export const getEventsByCategory = async(eventCategory: any): Promise<IEventDoc[] | any> => {
    const events = await eventModel.find({ category: eventCategory })
    return events;
}


/**
 * Update a event by id
 * @param {mongoose.Types.ObjectId} eventId
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
export const updateEventById = async(eventId: mongoose.Types.ObjectId, updateBody: UpdateEventBody): Promise<IEventDoc | null> => {
    const event = await getEventById(eventId);
    if (!event) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    if (updateBody.title && (await isEventNameTaken(updateBody.title, eventId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
    }
    Object.assign(event, updateBody);
    await event.save();
    return event;
}


/**
 * Update a event by name
 * @param {string} eventTitle
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
export const updateEventByName = async(eventTitle: string, updateBody: UpdateEventBody): Promise<IEventDoc | null> => {
    const event = await getEventByTitle(eventTitle);
    if (!event) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    if (updateBody.title && (await isEventNameTaken(updateBody.title, event._id))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
    }
    Object.assign(event, updateBody);
    await event.save();
    return event;
}

/**
 * Delete Event by id
 * @param {mongoose.Types.ObjectId} eventId
 * @returns {Promise<IInstructorDoc | null>}
 */
export const deleteEventById = async (eventId: mongoose.Types.ObjectId): Promise<IEventDoc | null> => {
    const event = await getEventById(eventId);
    if (!event) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    const user = await userModel.findById(event.organizer);

    if(user?.eventsAttended.includes(eventId)){
        user?.eventsAttended.splice(user?.eventsAttended.indexOf(eventId), 1);
        await user?.save();
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    await eventModel.findOneAndRemove({ _id: eventId })
    return event;
};

/**
 * Delete Event by name
 * @param {string} eventTitle
 * @returns {Promise<IInstructorDoc | null>}
 */
export const deleteEventByName = async (eventTitle: string): Promise<IEventDoc | null> => {
    const event = await getEventByTitle(eventTitle);
    if (!event) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    const user = await userModel.findById(event.organizer);

    if(user?.eventsAttended.includes(event.id)){
        user?.eventsAttended.splice(user?.eventsAttended.indexOf(event.id), 1);
        await user?.save();
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }
    await eventModel.findOneAndRemove({ name: eventTitle})
    return event;
};