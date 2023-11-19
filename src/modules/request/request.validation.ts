import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedRequest } from './request.interface';

const createRequestBody: Record<keyof NewCreatedRequest, any> = {
    organizerId: Joi.string().required(),
    reason: Joi.string(),
    nin: Joi.string(),
    associationName: Joi.string(),
    universityName: Joi.string(),
    type: Joi.string().required().valid('university', 'corporate'),
    presidentId: Joi.string(),
    driverLicense: Joi.string(),
    status: Joi.string().required().valid('pending', 'declined', 'accepted'),
};
  
export const createRequest = {
    body: Joi.object().keys(createRequestBody),
};

export const getAllRequests = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      RequestBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
};

export const getRequestsByOrganizer ={
    params: Joi.object().keys({
        organizerId: Joi.string(),
    }),
}

export const getRequest = {
    params: Joi.object().keys({
      RequestId: Joi.string().custom(objectId),
    }),
};

export const acceptRequest = {
    params: Joi.object().keys({
      RequestId: Joi.required().custom(objectId),
    })
};

export const declineRequest = {
    params: Joi.object().keys({
      RequestId: Joi.required().custom(objectId),
    })
};

export const updateRequest = {
    params: Joi.object().keys({
      RequestId: Joi.required().custom(objectId),
    })
};

export const deleteRequest = {
    params: Joi.object().keys({
    RequestId: Joi.string().custom(objectId)
    }),
};