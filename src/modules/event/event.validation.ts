import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedEvent } from './event.interface';

const createEventBody: Record<keyof NewCreatedEvent, any> = {
    title: Joi.string(),
    location: Joi.string(),
    color: Joi.string(),
    description: Joi.string(),
    venue: Joi.string(),
    startTime: Joi.string(),
    endTime: Joi.string(),
    price: Joi.number(),
    invites: Joi.array(),
    date: Joi.string(),
    processingFee: Joi.number(),
    tickets: Joi.array(),
    organizer: Joi.string(),
    image: Joi.string(),
    socials: Joi.array(),
    checkedIn: Joi.array(),
    category: Joi.array(),
    isStarted: Joi.boolean(),
    isEnded: Joi.boolean(),
    isCancelled: Joi.boolean()
};
  
export const createEvent = {
    body: Joi.object().keys(createEventBody),
};

export const getEventsByOrganizer = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      eventBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
};

export const getTopEvents = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    eventBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getEvents = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      eventBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
};

export const getRecentEventByTopOrganizer = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    eventBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getEvent = {
    params: Joi.object().keys({
      eventId: Joi.string().custom(objectId),
    }),
};

export const getEventByTitle = {
  params: Joi.object().keys({
    title: Joi.string()
  })
}

export const getEventTicketsByOrganizer = {
  params: Joi.object().keys({
    organizer: Joi.string().custom(objectId),
    title: Joi.string()
  })
}

export const getEventVolunteersByOrganizer = {
  params: Joi.object().keys({
    organizer: Joi.string().custom(objectId),
    title: Joi.string()
  })
}

export const getEventsByPrice = {
  params: Joi.object().keys({
    eventPrice: Joi.string()
  })
}

export const getEventByOrganizer = {
    params: Joi.object().keys({
      organizer: Joi.string().custom(objectId),
      title: Joi.string()
    }),
}

export const getRecentEventsByOrganizer = {
    params: Joi.object().keys({
      eventOrganizer: Joi.string(),
    }),
}

export const getTopEventsByOrganizer = {
    params: Joi.object().keys({
      organizer: Joi.string().custom(objectId),
    }),
}
  
export const updateEvent = {
    params: Joi.object().keys({
      eventId: Joi.required().custom(objectId),
    })
};

export const updateEventByName = {
  params: Joi.object().keys({
    eventName: Joi.string().required(),
  })
};
  
export const deleteEvent = {
    params: Joi.object().keys({
      eventId: Joi.string().custom(objectId)
    }),
};

export const deleteEventByName = {
  params: Joi.object().keys({
    eventName: Joi.string()
  })
}