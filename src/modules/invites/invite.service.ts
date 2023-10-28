import mongoose from 'mongoose';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import { NewCreatedInvite, UpdateInviteBody, IInviteDoc } from './invite.interface';
import { userModel, userInterfaces } from '../user';
import { eventModel } from '../event';
import inviteModel from './invite.model';


/**
 * Create Invite
 * @param { NewCreatedInvite } inviteBody
 * @returns { Promis<IInviteDoc | null> }
 */
export const createInvite = async (inviteBody: NewCreatedInvite): Promise<IInviteDoc | null> => {
    const check = await inviteModel.findOne({ email: inviteBody.email, eventId: inviteBody.eventId })
    if(check ){
        throw new ApiError(httpStatus.FORBIDDEN, "Invite already exists")
    } else {
        const user = await userModel.findOne({ email: inviteBody.email }) as any;
        const event = await eventModel.findById(inviteBody.eventId); 
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, "User not found")
        } else if(user?.role === "organizer" || user?.role === "admin"){
            throw new ApiError(httpStatus.FORBIDDEN, "You can't invite this user")
        } else {
            const invite = await inviteModel.create(inviteBody);
            console.log(user);
            if(!user?.invitations.includes(invite?._id)){
                user?.invitations.push(invite?._id)
                event?.invites.push(invite?._id as any);
                await event?.save();
                await user?.save();
            } else {
                throw new ApiError(httpStatus.NOT_FOUND, 'Invite already exists');
            }
            return invite;
        }
    }
}

/**
 * Get Invite by Id
 * @param {mongoose.Types.ObjectId} invitetId
 * @returns {Promise<IEventDoc | null>}
 */
export const getInviteById = async(inviteId: mongoose.Types.ObjectId): Promise<IInviteDoc | null> => {
    const event = await inviteModel.findById(inviteId);
    return event;
}


/**
 * Get all the invites
 * @returns {Promise<IInviteDoc | null>}
 */
export const getAllInvites = async ():Promise<any> => {
    const invites = await inviteModel.find();
    if(!invites){
        throw new ApiError(httpStatus.NOT_FOUND, 'No invite available')
    }
    return invites; 
}

/**
 * Get all the invites for User
 * @param {string} email
 * @returns {Promise<IInviteDoc | null>}
 */
export const getAllInvitesByUser = async (email: string):Promise<any> => {
    const invites = await inviteModel.find({ email: email });
    if(!invites){
        throw new ApiError(httpStatus.NOT_FOUND, 'No invites available')
    }
    return invites; 
}

/**
 * Get all the invites according to the Events
 * @param {mongoose.types.ObjectId} eventId
 * @returns {Promise<IInviteDoc | null>}
 */
export const getInvitesByEvent = async (eventId: string):Promise<any> => {
    const invites = await inviteModel.find({ eventId: eventId });
    if(!invites){
        throw new ApiError(httpStatus.NOT_FOUND, 'No invites available')
    }
    return invites; 
}


/**
 * Update an invite by id
 * @param {mongoose.Types.ObjectId} inviteId
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
export const updateInviteById = async(inviteId: mongoose.Types.ObjectId, updateBody: UpdateInviteBody): Promise<IInviteDoc | null> => {
    const invite = await getInviteById(inviteId);
    if (!invite) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invite not found');
    }
    Object.assign(invite, updateBody);
    await invite.save();
    return invite;
}

/**
 * Delete Invite by id
 * @param {mongoose.Types.ObjectId} inviteId
 * @returns {Promise<IInviteDoc | null>}
 */
export const deleteInviteById = async (inviteId: mongoose.Types.ObjectId): Promise<IInviteDoc | null> => {
    const invite = await getInviteById(inviteId);
    if (!invite) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invite not found');
    } else {
        const user = await userModel.findOne({ email: invite.email }) as any;
        const event = await eventModel.findById(invite.eventId)
        if(user?.invitations.includes(inviteId)){
            user?.invitations.splice(user?.invitations.indexOf(inviteId), 1);
            await user?.save();
        } else {
            throw new ApiError(httpStatus.NOT_FOUND, 'Invite not found');
        }

        if(event?.invites.includes(inviteId as any)){
            event?.invites.splice(event?.invites.indexOf(inviteId as any), 1);
            await event?.save();
        } else {
            throw new ApiError(httpStatus.NOT_FOUND, 'Invite not found');
        }
        await inviteModel.findOneAndRemove({ _id: inviteId })
        return invite;
    }
};
