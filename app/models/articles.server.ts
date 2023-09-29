import { type Prisma } from '@prisma/client';
import { prisma } from '~/db.server';

export type ArticlesWithCategoriesSummaryList = Omit<
  Prisma.ArticleGetPayload<{
    include: {
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
      categories: true,
    },
  });
}
