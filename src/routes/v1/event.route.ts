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
    .get(validate(eventValidation.getRecentEventByTopOrganizer), eventController.getRecentEventByTopOrganizer)

router
    .route('/organizer/:organizer')
    .get(validate(eventValidation.getEventsByOrganizer), eventController.getEventsByOrganizer)

router
    .route('/organizer/:organizer/title/:title')
    .get(validate(eventValidation.getEventByOrganizer), eventController.getEventByOrganizer)

router
    .route('/organizer/:organizer/title/:title/tickets')
    .get(validate(eventValidation.getEventTicketsByOrganizer), eventController.getEventTicketsByOrganizer)

router
    .route('/organizer/:organizer/title/:title/volunteers')
    .get(validate(eventValidation.getEventVolunteersByOrganizer), eventController.getEventVolunteersByOrganizer)

router
    .route('/title/:title')
    .get(validate(eventValidation.getEventByTitle), eventController.getEventByTitle)

router
  .route('/:eventId')
  .get(auth('manageEvents'), validate(eventValidation.getEvent), eventController.getEvent)
  .patch(auth('updateEvents'), validate(eventValidation.updateEvent), eventController.updateEvent)
  .delete(auth('deleteEvents'), validate(eventValidation.deleteEvent), eventController.deleteEvent);

export default router;