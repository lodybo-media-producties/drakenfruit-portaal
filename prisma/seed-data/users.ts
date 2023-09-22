import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client';

type UserWithPassword = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
  password: string;
};
export const users: UserWithPassword[] = [
  {
    email: 'kaylee@drakenfruit.com',
    locale: 'nl',
    firstName: 'Kaylee',
    lastName: 'Rosalina',
    role: 'ADMIN',
    organization: 'Drakenfruit',
    password: 'kayleeiscool',
  },
  {
    email: 'hi@lodybo.nl',
    locale: 'nl',
    firstName: 'Lody',
    lastName: 'Borgers',
    role: 'MAINTAINER',
    organization: 'Lodybo',
    password: 'lodyiscool',
  },
  {
    email: 'lisa@drakenfruit.com',
    locale: 'nl',
    firstName: 'Lisa',
    lastName: 'Jansen',
    role: 'CONSULTANT',
    organization: 'Drakenfruit',
    password: 'lisaiscool',
  },
  {
    email: 'silvia@ministerie.nl',
    locale: 'nl',
    firstName: 'Silvia',
    lastName: faker.person.lastName(),
    role: 'PROJECTMANAGER',
    organization: 'Ministerie van Huisvesting',
    password: 'silviaiscool',
  },
  {
    email: faker.internet.email(),
    locale: 'en',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: 'PROJECTMANAGER',
    organization: 'Agency For Ambition',
    password: 'password',
  },
];
