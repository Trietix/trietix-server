import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { inviteController, inviteValidation } from '../../modules/invites';

const router: Router = express.Router();

router
    .route('/user/:email')
    .get(auth(), validate(inviteValidation.getInvitesByUser), inviteController.getInvitesByUser)

router
    .route('/event/:eventId')
    .get(auth(), validate(inviteValidation.getInvitesByEvent), inviteController.getInvitesByEvent)

router
    .route('/')
    .post(auth(), validate(inviteValidation.createInvite), inviteController.createInvite)

router
  .route('/:inviteId')
  .get(auth(), validate(inviteValidation.getInvite), inviteController.getInvite)
  .patch(auth(), validate(inviteValidation.updateInvite), inviteController.updateInvite)
  .delete(auth(), validate(inviteValidation.deleteInvite), inviteController.deleteInvite);

export default router;