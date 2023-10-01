import { type User } from '~/models/user.server';
import { isAllowedForRole } from '~/utils/roles';

export function getEligibleAuthors(users: User[]) {
  return users
    .filter((user) => isAllowedForRole('CONSULTANT', user))
    .map(({ id, firstName, lastName }) => ({
      id,
      firstName,
      lastName,
    }));
}
