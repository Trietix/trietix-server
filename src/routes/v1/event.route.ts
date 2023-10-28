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
  .route('/top-events')
  .get(auth(), validate(eventValidation.getTopEvents), eventController.getTopEvents)

router
  .route('/recent-events')
  .get(auth(), validate(eventValidation.getRecentEvents), eventController.getRecentEvents)

router
    .route('/organizer/:organizer')
    .get(auth(), validate(eventValidation.getEventsByOrganizer), eventController.getEventsByOrganizer)

router
    .route('/organizer/:organizer/recent-events')
    .get(auth(), validate(eventValidation.getRecentEventsByOrganizer), eventController.getRecentEventsByOrganizer)

router
    .route('/organizer/:organizer/top-events')
    .get(auth(), validate(eventValidation.getTopEventsByOrganizer), eventController.getTopEventsByOrganizer)
    
router
    .route('/price/:eventPrice')
    .get(auth(), validate(eventValidation.getEventsByPrice), eventController.getEventsByPrice)
    
router
    .route('/category/:eventCategory')
    .get(auth(), validate(eventValidation.getEventsByCategory), eventController.getEventsByCategory)

router
    .route('/title/:title')
    .get(validate(eventValidation.getEventByTitle), eventController.getEventByTitle)

router
    .route('/title/:title/tickets')
    .get(auth(), validate(eventValidation.getEventTickets), eventController.getEventTickets)

router
    .route('/title/:title/volunteers')
    .get(auth(), validate(eventValidation.getEventVolunteers), eventController.getEventVolunteers)

// router
//     .route('/title/:eventTitle/revenue')
//     .get(auth(), validate(eventValidation.getEventRevenue), eventController.getEventRevenue)

router
  .route('/:eventId')
  .get(auth('manageEvents'), validate(eventValidation.getEvent), eventController.getEvent)
  .patch(auth('updateEvents'), validate(eventValidation.updateEvent), eventController.updateEvent)
  .delete(auth('deleteEvents'), validate(eventValidation.deleteEvent), eventController.deleteEvent);

export default router;