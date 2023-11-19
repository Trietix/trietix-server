import mongoose from 'mongoose';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import { NewCreatedRequest, UpdateRequestBody, IRequestDoc } from './request.interface';
import { userModel, userInterfaces, userService } from '../user';
import requestModel from './request.model';
import { sendMail } from '../utils/sendMail'; 


/**
 * Create Request
 * @param { NewCreatedRequest } RequestBody
 * @returns { Promis<IRequestDoc | null> }
 */
export const createRequest = async (RequestBody: NewCreatedRequest): Promise<any | null> => {
    const check = await requestModel.findOne({ organizerId: RequestBody.organizerId, status: "pending" }) as any;
    if(check){
        throw new ApiError(httpStatus.FORBIDDEN, `You already requested for verification at ${new Date(check.createdAt as any).toISOString().toLocaleString()}`)
    }  else {
        const Request = await requestModel.create(RequestBody) as any;
        const user = await userService.getUserById(RequestBody.organizerId as any)
        sendMail(user?.email as any, `You've requested verification for your account - Trietix`, {organizerName: user?.name, accountName: user?.accountName, accountBank: user?.bank, requestTime: Request?.createdAt }, "organizer/request.hbs")
        sendMail("trietixhq@gmail.com", `${user?.name} requested verification for their account - Trietix`, { organizerName: user?.name, url:`https://guru.trietix.com/request/${Request._id}`}, "guru/request.hbs")
        return Request;
    }
}

/**
 * Get Request by Id
 * @param {mongoose.Types.ObjectId} RequesttId
 * @returns {Promise<IEventDoc | null>}
 */
export const getRequestById = async(RequestId: mongoose.Types.ObjectId): Promise<IRequestDoc | null> => {
    const request = await requestModel.findById(RequestId);
    return request;
}


/**
 * Get all the Requests
 * @returns {Promise<IRequestDoc | null>}
 */
export const getAllRequests = async ():Promise<any> => {
    const requests = await requestModel.find();
    if(!requests){
        throw new ApiError(httpStatus.NOT_FOUND, 'No Request available')
    }
    return requests; 
}

/**
 * Get all the Requests for Organizer
 * @param {string} organizerId
 * @returns {Promise<IRequestDoc | null>}
 */
export const getAllRequestsByOrganizer = async (organizerId: string):Promise<any> => {
    const Requests = await requestModel.find({ organizerId: organizerId });
    if(!Requests){
        throw new ApiError(httpStatus.NOT_FOUND, 'No Requests available')
    }
    return Requests; 
}

/**
 * Update an Request by id
 * @param {mongoose.Types.ObjectId} RequestId
 * @param {UpdateEventBody} updateBody
 * @returns {Promise<IEventDoc | null>}
 */
export const updateRequestById = async(RequestId: mongoose.Types.ObjectId, updateBody: UpdateRequestBody): Promise<IRequestDoc | null> => {
    const Request = await getRequestById(RequestId);
    if (!Request) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    }
    Object.assign(Request, updateBody);
    await Request.save();
    return Request;
}

/**
 * Delete Request by id
 * @param {mongoose.Types.ObjectId} RequestId
 * @returns {Promise<any | null>}
 */
export const deleteRequestById = async (RequestId: mongoose.Types.ObjectId): Promise<any | null> => {
    const Request = await getRequestById(RequestId) as any;
    if (!Request) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    } else {
        await requestModel.findOneAndRemove({ _id: RequestId })
        return Request;
    }
};
