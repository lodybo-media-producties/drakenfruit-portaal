import { type Prisma } from '@prisma/client';
import { type SerializedArticle as Article } from '~/models/articles.server';

export type ArticleValidationErrors = {
  image?: string;
  title?: string;
  summary?: string;
  content?: string;
  author?: string;
  categories?: string;
};

export type ArticleFormValues = Omit<
  Article,
  'id' | 'published' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
  categories: string[];
  published?: boolean;
};

export type ArticleWithAuthorAndCategories = Prisma.ArticleGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
      };
    };
    categories: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
  };
}>;
