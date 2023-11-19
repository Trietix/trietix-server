"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const event_route_1 = __importDefault(require("./event.route"));
const user_route_1 = __importDefault(require("./user.route"));
const ticket_route_1 = __importDefault(require("./ticket.route"));
const invite_route_1 = __importDefault(require("./invite.route"));
const payout_route_1 = __importDefault(require("./payout.route"));
const request_route_1 = __importDefault(require("./request.route"));
const router = express_1.default.Router();
const defaultIRoute = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/users',
        route: user_route_1.default,
    },
    {
        path: '/event',
        route: event_route_1.default,
    },
    {
        path: '/ticket',
        route: ticket_route_1.default,
    },
    {
        path: '/invite',
        route: invite_route_1.default,
    },
    {
        path: '/payout',
        route: payout_route_1.default,
    },
    {
        path: '/request',
        route: request_route_1.default,
    },
];
defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
