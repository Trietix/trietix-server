import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { userController, userValidation } from '../../modules/user';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(auth(), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/me')
  .get(auth('getAccount'), userController.getMe);

router
  .route('/organizers')
  .get(auth('getOrganizers'),validate(userValidation.getOrganizers), userController.getOrganizers)

router
  .route('/top-organizers')
  .get(auth('getTopOrganizers'), validate(userValidation.getTopOrganizers), userController.getTopOrganizers)

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('updateUser'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('deleteUser'), validate(userValidation.deleteUser), userController.deleteUser);

export default router;