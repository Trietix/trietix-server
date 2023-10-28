import express, { Router } from 'express';
import authRoute from './auth.route';
import eventRoute from './event.route';
import userRoute from './user.route';
import ticketRoute from './ticket.route';
import inviteRoute from './invite.route';
import payoutRoute from './payout.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/event',
    route: eventRoute,
  },
  {
    path: '/ticket',
    route: ticketRoute,
  },
  {
    path: '/invite',
    route: inviteRoute,
  },
  {
    path: '/payout',
    route: payoutRoute,
  },
];


defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
