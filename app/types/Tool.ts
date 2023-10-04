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
