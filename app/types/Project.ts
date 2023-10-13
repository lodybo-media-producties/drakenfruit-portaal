import { type Prisma, type Project } from '@prisma/client';

type CoreProjectData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export type ProjectsWithOrganisationAndUsers = Prisma.ProjectGetPayload<{
  include: {
    organisation: {
      select: {
        name: boolean;
      };
    };
    users: {
      select: {
        firstName: boolean;
        lastName: boolean;
      };
    };
  };
}>;

export type ProjectValidationErrors = Partial<
  Record<keyof CoreProjectData, string>
>;

export type ProjectFormValues = CoreProjectData & {
  id?: string;
};
