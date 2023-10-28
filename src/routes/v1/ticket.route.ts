import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { ticketController, ticketValidation } from '../../modules/ticket';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(ticketValidation.createTicket), ticketController.createTicket)
  .get(auth(), validate(ticketValidation.getTickets), ticketController.getTickets);

router
    .route('/organizer/:organizer')
    .get(auth(), validate(ticketValidation.getTicketsByOrganizer), ticketController.getTicketsByOrganizer)

router
    .route('/user/:userId')
    .get(auth(), validate(ticketValidation.getTicketsByUser), ticketController.getTicketsByUser)
    
router
    .route('/price/:ticketPrice')
    .get(auth(), validate(ticketValidation.getTicketsByPrice), ticketController.getTicketsByPrice)

router
  .route('/:ticketId')
  .get(auth('manageTickets'), validate(ticketValidation.getTicket), ticketController.getTicket)
  .patch(auth('updateTickets'), validate(ticketValidation.updateTicket), ticketController.updateTicket)
  .delete(auth('deleteTickets'), validate(ticketValidation.deleteTicket), ticketController.deleteTicket);

  router
  .route('/get/:transactionId')
  .get(validate(ticketValidation.getTicketByTransactionId), ticketController.getTicketByTransactionId)


export default router;