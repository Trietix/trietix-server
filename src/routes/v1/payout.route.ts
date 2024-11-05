import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { payoutController, payoutValidation } from '../../modules/payout';

const router: Router = express.Router();

router
    .route('/organizer/:organizer')
    .get(auth(), validate(payoutValidation.getPayoutsByOrganizer), payoutController.getPayoutsByOrganizer)

router
    .route('/event/:eventId')
    .get(auth(), validate(payoutValidation.getPayoutsByEvent), payoutController.getPayoutsByEvent)

router
    .route('/')
    .post(auth(), validate(payoutValidation.createPayout), payoutController.createPayout)

router
    .route('/pibtrynu/895gs456thn3wxg')
    .get(validate(payoutValidation.getPayouts), payoutController.getAdminAllPayouts)

router
  .route('/:payoutId')
  .get(auth(), validate(payoutValidation.getPayout), payoutController.getPayout)
  .patch(auth(), validate(payoutValidation.updatePayout), payoutController.updatePayout)
  .delete(auth(), validate(payoutValidation.deletePayout), payoutController.deletePayout);

export default router;