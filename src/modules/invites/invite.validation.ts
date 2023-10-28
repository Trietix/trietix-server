import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedInvite } from './invite.interface';

const createInviteBody: Record<keyof NewCreatedInvite, any> = {
    email: Joi.string(),
    eventId: Joi.string(),
    status: Joi.string().required().valid('pending', 'accepted', 'declined'),
};
  
export const createInvite = {
    body: Joi.object().keys(createInviteBody),
};

export const getInvites = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      inviteBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
};

export const getInvitesByUser ={
    params: Joi.object().keys({
        email: Joi.string(),
    }),
}

export const getInvitesByEvent ={
    params: Joi.object().keys({
        eventId: Joi.string(),
    }),
}

export const getInvite = {
    params: Joi.object().keys({
      inviteId: Joi.string().custom(objectId),
    }),
};

export const updateInvite = {
    params: Joi.object().keys({
      inviteId: Joi.required().custom(objectId),
    })
};

export const deleteInvite = {
    params: Joi.object().keys({
      inviteId: Joi.string().custom(objectId)
    }),
};