import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { requestController, requestValidation } from '../../modules/request';

const router: Router = express.Router();

router
    .route('/organizer/:organizer')
    .get(auth(), validate(requestValidation.getRequestsByOrganizer), requestController.getRequestsByOrganizer)

router
    .route('/')
    .get(auth(), validate(requestValidation.getAllRequests), requestController.getAllRequests)
    .post(auth(), validate(requestValidation.createRequest), requestController.createRequest)

router
  .route('/:RequestId')
  .get(auth(), validate(requestValidation.getRequest), requestController.getRequest)
  .patch(auth(), validate(requestValidation.updateRequest), requestController.updateRequest)
  .delete(auth(), validate(requestValidation.deleteRequest), requestController.deleteRequest);

router
  .route('/:RequestId/accept')
  .patch(auth(), validate(requestValidation.acceptRequest), requestController.acceptRequest);

router
  .route('/:RequestId/decline')
  .patch(auth(), validate(requestValidation.declineRequest), requestController.declineRequest);

export default router;