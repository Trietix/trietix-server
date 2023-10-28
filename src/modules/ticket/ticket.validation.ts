import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedTicket } from './ticket.interface';

const createTicketBody: Record<keyof NewCreatedTicket, any> = {
    email: Joi.string().required(),
    amount: Joi.number().required(),
    ticketId: Joi.string().required(),
    price: Joi.number().required(),
    event: Joi.string().required(),
    isCheckedIn: Joi.boolean().required(),
    user: Joi.any(),
    noOfCheckedIn: Joi.number(),
};
  
export const createTicket = {
    body: Joi.object().keys(createTicketBody),
};

export const getTickets = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      ticektBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
};

export const getTicketsByCategory = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const getTicketByTransactionId = {
  params: Joi.object().keys({
    transactionId: Joi.string(),
  }),
};


export const getTicket = {
    params: Joi.object().keys({
      ticektId: Joi.string().custom(objectId),
    }),
};

export const getTicketsByOrganizer = {
    params: Joi.object().keys({
        organizer: Joi.string(),
    }),
}

export const getTicketsByUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
}

export const getTicketsByPrice = {
    params: Joi.object().keys({
        ticektOrganizer: Joi.string(),
    }),
}

export const updateTicket = {
    params: Joi.object().keys({
      ticektId: Joi.required().custom(objectId),
    })
}
  
export const deleteTicket = {
    params: Joi.object().keys({
      ticektId: Joi.string().custom(objectId)
    }),
};