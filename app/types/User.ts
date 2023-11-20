import { type User } from '~/models/user.server';
import { type Prisma } from '@prisma/client';

type CoreUserData = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'role' | 'bookmarks'
>;

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
  role?: string;
  projectIds?: string;
};

export type UserFormValues = CoreUserData & {
  role: string;
  id?: string;
  projectIds: string[];
};
