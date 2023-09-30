import { type Prisma, type Article } from '@prisma/client';
import { prisma } from '~/db.server';
import { type SerializeFrom } from '@remix-run/server-runtime';

export type SerializedArticle = SerializeFrom<Article>;

export { Article };

export type ArticlesWithCategoriesSummaryList = Omit<
  Prisma.ArticleGetPayload<{
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
        };
      };
    };
  }>,
  'createdAt' | 'updatedAt'
>;

export function getArticlesSummaryList(): Promise<
  ArticlesWithCategoriesSummaryList[]
> {
  return prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      categories: true,
    },
  });
}
