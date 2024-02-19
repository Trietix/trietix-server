import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedTicket } from './ticket.interface';

const createTicketBody: Record<keyof NewCreatedTicket, any> = {
    email: Joi.string().required(),
    amount: Joi.number().required(),
    ticketId: Joi.string().required(),
    processingFee: Joi.number().required(),
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
      ticketBy: Joi.string(),
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
      ticketId: Joi.string().custom(objectId),
    }),
};

export const getTicketsByOrganizer = {
    params: Joi.object().keys({
        organizer: Joi.string(),
    }),
}

export const getRevenueByOrganizer = {
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
        ticketOrganizer: Joi.string(),
    }),
}

export const updateTicket = {
    params: Joi.object().keys({
      ticketId: Joi.required().custom(objectId),
    })
}
  
export const deleteTicket = {
    params: Joi.object().keys({
      ticketId: Joi.string().custom(objectId)
    }),
};
