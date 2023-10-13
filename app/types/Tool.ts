import { type Prisma } from '@prisma/client';
import { type Tool } from '~/models/tools.server';

export type ToolValidationErrors = Partial<Record<keyof Tool, string>> & {
  categories?: string;
};

export type ToolFormValues = Omit<
  Tool,
  'id' | 'createdAt' | 'updatedAt' | 'categories'
> & {
  id?: string;
  categories: string[];
};

export type SummarisedTool = Prisma.ToolGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    summary: true;
    image: true;
    categories: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    createdAt: true;
    updatedAt: true;
  };
}>;
