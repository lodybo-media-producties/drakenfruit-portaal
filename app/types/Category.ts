import { type Category } from '~/models/categories.server';

export type CategoryValidationErrors = {
  name?: string;
  slug?: string;
  description?: string;
};

export type CategoryFormValues = Omit<
  Category,
  'id' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
};
