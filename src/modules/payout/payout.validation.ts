import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedPayout } from './payout.interface';

const createPayoutBody: Record<keyof NewCreatedPayout, any> = {
    organizerId: Joi.string(),
    eventId: Joi.string(),
    status: Joi.string().required().valid('Not paid', 'Paid', 'declined'),
};
  
export const createPayout = {
    body: Joi.object().keys(createPayoutBody),
};

export const getPayouts = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      PayoutBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
};

export const getPayoutsByOrganizer ={
    params: Joi.object().keys({
        organizerId: Joi.string(),
    }),
}

export const getPayoutsByEvent ={
    params: Joi.object().keys({
        eventId: Joi.string(),
    }),
}

export const getPayout = {
    params: Joi.object().keys({
      payoutId: Joi.string().custom(objectId),
    }),
};

export const updatePayout = {
    params: Joi.object().keys({
      payoutId: Joi.required().custom(objectId),
    })
};

export const deletePayout = {
    params: Joi.object().keys({
      payoutId: Joi.string().custom(objectId)
    }),
};