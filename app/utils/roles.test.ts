import { describe, test } from 'vitest';
import { type User } from '~/models/user.server';
import { isAllowedForRole, isStrictlyAllowedForRole } from '~/utils/roles';

describe('Roles', () => {
  const user: User = {
    id: '1',
    email: '',
    firstName: '',
    lastName: '',
    locale: 'en',
    role: 'PROJECTLEADER',
    organisationId: '1',
    createdAt: '',
    updatedAt: '',
  };

  test('The correct permissions are returned for a role and upwards', () => {
    user.role = 'PROJECTLEADER';
    expect(isAllowedForRole('PROJECTLEADER', user)).toBe(true);
    expect(isAllowedForRole('CONSULTANT', user)).toBe(false);
    expect(isAllowedForRole('OFFICEMANAGER', user)).toBe(false);
    expect(isAllowedForRole('ADMIN', user)).toBe(false);
    expect(isAllowedForRole('MAINTAINER', user)).toBe(false);

    user.role = 'CONSULTANT';
    expect(isAllowedForRole('PROJECTLEADER', user)).toBe(true);
    expect(isAllowedForRole('CONSULTANT', user)).toBe(true);
    expect(isAllowedForRole('OFFICEMANAGER', user)).toBe(false);
    expect(isAllowedForRole('ADMIN', user)).toBe(false);
    expect(isAllowedForRole('MAINTAINER', user)).toBe(false);

    user.role = 'OFFICEMANAGER';
    expect(isAllowedForRole('PROJECTLEADER', user)).toBe(true);
    expect(isAllowedForRole('CONSULTANT', user)).toBe(true);
    expect(isAllowedForRole('OFFICEMANAGER', user)).toBe(true);
    expect(isAllowedForRole('ADMIN', user)).toBe(false);
    expect(isAllowedForRole('MAINTAINER', user)).toBe(false);

    user.role = 'ADMIN';
    expect(isAllowedForRole('PROJECTLEADER', user)).toBe(true);
    expect(isAllowedForRole('CONSULTANT', user)).toBe(true);
    expect(isAllowedForRole('OFFICEMANAGER', user)).toBe(true);
    expect(isAllowedForRole('ADMIN', user)).toBe(true);
    expect(isAllowedForRole('MAINTAINER', user)).toBe(false);

    user.role = 'MAINTAINER';
    expect(isAllowedForRole('PROJECTLEADER', user)).toBe(true);
    expect(isAllowedForRole('CONSULTANT', user)).toBe(true);
    expect(isAllowedForRole('OFFICEMANAGER', user)).toBe(true);
    expect(isAllowedForRole('ADMIN', user)).toBe(true);
    expect(isAllowedForRole('MAINTAINER', user)).toBe(true);
  });

  test('The correct permissions are returned for a role only when strictly checked', () => {
    user.role = 'PROJECTLEADER';
    expect(isStrictlyAllowedForRole('PROJECTLEADER', user)).toBe(true);
    expect(isStrictlyAllowedForRole('CONSULTANT', user)).toBe(false);
    expect(isStrictlyAllowedForRole('OFFICEMANAGER', user)).toBe(false);
    expect(isStrictlyAllowedForRole('ADMIN', user)).toBe(false);
    expect(isStrictlyAllowedForRole('MAINTAINER', user)).toBe(false);

    user.role = 'CONSULTANT';
    expect(isStrictlyAllowedForRole('PROJECTLEADER', user)).toBe(false);
    expect(isStrictlyAllowedForRole('CONSULTANT', user)).toBe(true);
    expect(isStrictlyAllowedForRole('OFFICEMANAGER', user)).toBe(false);
    expect(isStrictlyAllowedForRole('ADMIN', user)).toBe(false);
    expect(isStrictlyAllowedForRole('MAINTAINER', user)).toBe(false);

    user.role = 'OFFICEMANAGER';
    expect(isStrictlyAllowedForRole('PROJECTLEADER', user)).toBe(false);
    expect(isStrictlyAllowedForRole('CONSULTANT', user)).toBe(false);
    expect(isStrictlyAllowedForRole('OFFICEMANAGER', user)).toBe(true);
    expect(isStrictlyAllowedForRole('ADMIN', user)).toBe(false);
    expect(isStrictlyAllowedForRole('MAINTAINER', user)).toBe(false);

    user.role = 'ADMIN';
    expect(isStrictlyAllowedForRole('PROJECTLEADER', user)).toBe(false);
    expect(isStrictlyAllowedForRole('CONSULTANT', user)).toBe(false);
    expect(isStrictlyAllowedForRole('OFFICEMANAGER', user)).toBe(false);
    expect(isStrictlyAllowedForRole('ADMIN', user)).toBe(true);
    expect(isStrictlyAllowedForRole('MAINTAINER', user)).toBe(false);

    user.role = 'MAINTAINER';
    expect(isStrictlyAllowedForRole('PROJECTLEADER', user)).toBe(false);
    expect(isStrictlyAllowedForRole('CONSULTANT', user)).toBe(false);
    expect(isStrictlyAllowedForRole('OFFICEMANAGER', user)).toBe(false);
    expect(isStrictlyAllowedForRole('ADMIN', user)).toBe(false);
    expect(isStrictlyAllowedForRole('MAINTAINER', user)).toBe(true);
  });
});
