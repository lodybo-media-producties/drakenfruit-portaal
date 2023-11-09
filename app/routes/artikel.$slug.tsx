import { json, type LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { getLocalisedArticleBySlug } from '~/models/articles.server';
import { requireUserWithMinimumRole } from '~/session.server';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import Prose from '~/components/Prose';
import { convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import { Image } from '~/components/Image';
import i18next from '~/i18next.server';
import AnchorLink from '~/components/AnchorLink';
import { useTranslation } from 'react-i18next';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('PROJECTLEADER', request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  const t = await i18next.getFixedT(request, 'routes');

  try {
    const fullArticle = await getLocalisedArticleBySlug(slug, 'nl');
    const article = convertPrismaArticleToLocalisedArticle(fullArticle, 'nl');

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
  const { t } = useTranslation('routes');

  return (
    <div className="w-full">
      {article.image ? (
        <Image
          className="h-[30rem]"
          src={article.image}
          alt={article.title}
          fit="cover"
        />
      ) : null}

      <div className="w-3/4 mx-auto py-8">
        <AnchorLink to="/">{t('Articles.Detail.Back Link Label')}</AnchorLink>
      </div>

      <Prose>
        <h1>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </Prose>
    </div>
  );
}
