import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { eventController, eventValidation } from '../../modules/event';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(eventValidation.createEvent), eventController.createEvent)
  .get(validate(eventValidation.getEvents), eventController.getEvents);

router
    .route('/organizer/top/recent')
    .get(auth(), validate(eventValidation.getRecentEventByTopOrganizer), eventController.getRecentEventByTopOrganizer)

router
    .route('/organizer/:organizer')
    .get(auth(), validate(eventValidation.getEventsByOrganizer), eventController.getEventsByOrganizer)

router
    .route('/organizer/:organizer/title/:title')
    .get(auth(), validate(eventValidation.getEventByOrganizer), eventController.getEventByOrganizer)

router
    .route('/organizer/:organizer/title/:title/tickets')
    .get(auth(), validate(eventValidation.getEventTicketsByOrganizer), eventController.getEventTicketsByOrganizer)

router
    .route('/organizer/:organizer/title/:title/volunteers')
    .get(auth(), validate(eventValidation.getEventVolunteersByOrganizer), eventController.getEventVolunteersByOrganizer)

router
    .route('/title/:title')
    .get(validate(eventValidation.getEventByTitle), eventController.getEventByTitle)

router
  .route('/:eventId')
  .get( validate(eventValidation.getEvent), eventController.getEvent)
  .patch(auth('updateEvents'), validate(eventValidation.updateEvent), eventController.updateEvent)
  .delete(auth('deleteEvents'), validate(eventValidation.deleteEvent), eventController.deleteEvent);

export default router;