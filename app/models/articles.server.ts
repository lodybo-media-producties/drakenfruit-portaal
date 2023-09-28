import { type Prisma } from '@prisma/client';
import { prisma } from '~/db.server';

export type ArticlesWithCategoriesSummaryList = Prisma.ArticleGetPayload<{
  include: {
    categories: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

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
