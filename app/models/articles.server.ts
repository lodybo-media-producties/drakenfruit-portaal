import { type Prisma, type Article } from '@prisma/client';
import { prisma } from '~/db.server';
import { type SerializeFrom } from '@remix-run/node';
import { type User } from '~/models/user.server';

export type SerializedArticle = SerializeFrom<Article>;

export { Article };

export type LocalisedArticle = Record<keyof Article, string> & {
  author: User;
  categories: Prisma.CategoryGetPayload<{
    select: {
      id: true;
      name: true;
      slug: true;
    };
  }>;
};

export type SummarisedArticle = Prisma.ArticleGetPayload<{
  select: {
    id: true;
    title: true;
    summary: true;
    slug: true;
    image: true;
    categories: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    author: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
      };
    };
    createdAt: true;
    updatedAt: true;
  };
}>;

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

export function getSummarisedArticles(): Promise<SummarisedArticle[]> {
  return prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    where: { published: true },
    select: {
      id: true,
      title: true,
      summary: true,
      slug: true,
      image: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export function getArticleById(id: string) {
  return prisma.article.findUniqueOrThrow({
    where: { id },
    include: {
      author: true,
      categories: true,
    },
  });
}

export function getLocalisedArticleBySlug(slug: string, locale: string) {
  return prisma.article.findFirstOrThrow({
    where: {
      slug: {
        path: [locale],
        equals: slug,
      },
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}
