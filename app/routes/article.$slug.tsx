import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { getLocalisedArticleBySlug } from '~/models/articles.server';
import { requireUserWithMinimumRole } from '~/session.server';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import Prose from '~/components/Prose';
import { convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import { Image } from '~/components/Image';
import i18next from '~/i18next.server';
import { useTranslation } from 'react-i18next';
import AnchorLink from '~/components/AnchorLink';
import ArticleDetails from '~/components/ArticleDetails';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('PROJECTLEADER', request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  const t = await i18next.getFixedT(request, 'routes');

  try {
    const fullArticle = await getLocalisedArticleBySlug(slug, 'en');
    const article = convertPrismaArticleToLocalisedArticle(fullArticle, 'en');

    const metaTranslations = {
      title: t('Articles.Detail.Meta.Title', { articleTitle: article.title }),
    };

    return json({ article, metaTranslations });
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
  const { article } = useLoaderData<typeof loader>();

  return <ArticleDetails article={article} />;
}
