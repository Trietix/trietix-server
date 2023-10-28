"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const allRoles = {
    user: ['registerUser', 'loginUser', 'logoutUser', 'createEvent', 'deleteEvent', 'getEvents', 'getPublicName', 'getPrivateName'],
    admin: ['getUsers', 'manageUsers'],
    organizer: []
};
exports.roles = Object.keys(allRoles);
exports.roleRights = new Map(Object.entries(allRoles));
