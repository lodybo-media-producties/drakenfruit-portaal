import { type Organisation, type Prisma } from '@prisma/client';

type CoreOrganisationData = Omit<
  Organisation,
  'id' | 'createdAt' | 'updatedAt'
>;

export type OrganisationsWithUserCount = Prisma.OrganisationGetPayload<{
  include: {
    _count: {
      select: {
        users: boolean;
      };
    };
  };
}>;

export type OrganisationValidationErrors = Partial<
  Record<keyof CoreOrganisationData, string>
>;

export type OrganisationFormValues = CoreOrganisationData & {
  id?: string;
};
