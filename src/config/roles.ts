const allRoles = {
  user: ['registerUser', 'loginUser', 'logoutUser', 'createEvent', 'deleteEvent', 'getEvents', 'getPublicName', 'getPrivateName'],
  admin: ['getUsers', 'manageUsers'],
  organizer : []
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
