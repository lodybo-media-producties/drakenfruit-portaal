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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('PROJECTLEADER', request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  const t = await i18next.getFixedT(request, 'routes');

  try {
    const fullArticle = await getLocalisedArticleBySlug(slug, 'nl');
    const article = convertPrismaArticleToLocalisedArticle(fullArticle, 'nl');
    const articleIsBookmarked = await hasBookmarked(user.id, article.id);

    const metaTranslations = {
      title: t('Articles.Detail.Meta.Title', { articleTitle: article.title }),
    };

    return json({ article, articleIsBookmarked, metaTranslations });
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
  const { article, articleIsBookmarked } = useLoaderData<typeof loader>();

  return (
    <ArticleDetails article={article} isBookmarked={articleIsBookmarked} />
  );
}
