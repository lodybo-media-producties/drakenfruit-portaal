import { describe, test } from 'vitest';
import { type User } from '~/models/user.server';
import { getEligibleAuthors } from '~/utils/users';

describe('User utils', () => {
  test('Filter eligible authors out of the list of users', () => {
    const users: User[] = [
      {
        id: '1',
        firstName: 'User',
        lastName: 'One',
        email: 'a@b.c',
        role: 'PROJECTLEADER',
        organisationId: '1',
        locale: 'nl',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        firstName: 'User',
        lastName: 'Two',
        email: 'a@b.c',
        role: 'CONSULTANT',
        organisationId: '1',
        locale: 'nl',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        firstName: 'User',
        lastName: 'Three',
        email: 'a@b.c',
        role: 'CONSULTANT',
        organisationId: '1',
        locale: 'nl',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        firstName: 'User',
        lastName: 'Four',
        email: 'a@b.c',
        role: 'PROJECTLEADER',
        organisationId: '1',
        locale: 'nl',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        firstName: 'User',
        lastName: 'Five',
        email: 'a@b.c',
        role: 'OFFICEMANAGER',
        organisationId: '1',
        locale: 'nl',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6',
        firstName: 'User',
        lastName: 'Six',
        email: 'a@b.c',
        role: 'ADMIN',
        organisationId: '1',
        locale: 'nl',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7',
        firstName: 'User',
        lastName: 'Seven',
        email: 'a@b.c',
        role: 'MAINTAINER',
        organisationId: '1',
        locale: 'nl',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const eligibleAuthors = getEligibleAuthors(users);

    expect(eligibleAuthors).toEqual([
      {
        id: '2',
        firstName: 'User',
        lastName: 'Two',
      },
      {
        id: '3',
        firstName: 'User',
        lastName: 'Three',
      },
      {
        id: '5',
        firstName: 'User',
        lastName: 'Five',
      },
      {
        id: '6',
        firstName: 'User',
        lastName: 'Six',
      },
      {
        id: '7',
        firstName: 'User',
        lastName: 'Seven',
      },
    ]);
  });
});
