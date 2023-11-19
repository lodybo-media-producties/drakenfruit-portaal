import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { getLocalisedArticleBySlug } from '~/models/articles.server';
import { requireUserWithMinimumRole } from '~/session.server';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import { convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import i18next from '~/i18next.server';
import ArticleDetails from '~/components/ArticleDetails';
import { hasBookmarked } from '~/models/user.server';
import { prisma } from '~/db.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('PROJECTLEADER', request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  const t = await i18next.getFixedT(request, 'routes');

  try {
    const fullArticle = await getLocalisedArticleBySlug(slug, 'en');
    const article = convertPrismaArticleToLocalisedArticle(fullArticle, 'en');
    const articleIsBookmarked = await hasBookmarked(user.id, article.id);

    const relatedArticles = await prisma.article.findMany({
      where: {
        id: {
          not: article.id,
        },
        categories: {
          some: {
            id: {
              in: article.categories.map((category) => category.id),
            },
          },
        },
      },
      take: 3,
    });

    console.log('categories', fullArticle.categories);
    console.log('relatedArticles', relatedArticles);

    const localisedRelatedArticles = relatedArticles.map((relatedArticle) => ({
      id: relatedArticle.id,
      title: relatedArticle.title['en'],
      slug: relatedArticle.slug['en'],
    }));

    const metaTranslations = {
      title: t('Articles.Detail.Meta.Title', { articleTitle: article.title }),
    };

    return json({
      article,
      articleIsBookmarked,
      relatedArticles: localisedRelatedArticles,
      metaTranslations,
    });
  } catch (error) {
    throw new Error(`Error loading article: ${error}`);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function DutchArticlePage() {
  const { article, articleIsBookmarked, relatedArticles } =
    useLoaderData<typeof loader>();

  return (
    <ArticleDetails
      article={article}
      isBookmarked={articleIsBookmarked}
      relatedArticles={relatedArticles}
    />
  );
}
