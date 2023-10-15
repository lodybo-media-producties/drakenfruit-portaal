import { type User } from '~/models/user.server';
import { type Prisma } from '@prisma/client';

type CoreUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UserWithProjectsAndOrgs = Prisma.UserGetPayload<{
  include: {
    projects: {
      select: {
        id: true;
        name: true;
      };
    };
    organisation: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type UserValidationErrors = Partial<
  Record<keyof CoreUserData, string>
> & {
  password?: string;
};

export type UserFormValues = CoreUserData & {
  id?: string;
  password?: string;
};
