import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { authValidation, authController, auth } from '../../modules/auth';

const router: Router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.route('/logout').post(auth(), validate(authValidation.logout), authController.logout);
router.route('/refresh-tokens').post(validate(authValidation.refreshTokens), authController.refreshTokens);

export default router;