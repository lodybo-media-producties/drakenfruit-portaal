import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import {
  getLocalisedArticleBySlug,
  getRelatedArticlesForArticle,
} from '~/models/articles.server';
import { getUser } from '~/session.server';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import { convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import i18next from '~/i18next.server';
import ArticleDetails from '~/components/ArticleDetails';
import {
  hasBookmarked,
  requireUserHasPurchasedItem,
} from '~/models/user.server';
import {
  ArticleLoaderData,
  type ArticleWithAuthorAndCategories,
  type LocalisedArticle,
} from '~/types/Article';
import { getiDEALIssuers, Issuer } from '~/payments.server';
import PaymentWall from '~/components/PaymentWall';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await getUser(request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  const t = await i18next.getFixedT(request, 'routes');

  try {
    const fullArticle = await getLocalisedArticleBySlug(slug, 'en');
    const article = convertPrismaArticleToLocalisedArticle(fullArticle, 'en');

    const relatedArticles = await getRelatedArticlesForArticle(
      article as unknown as LocalisedArticle<ArticleWithAuthorAndCategories>
    );

    const localisedRelatedArticles = relatedArticles.map((relatedArticle) => ({
      id: relatedArticle.id,
      title: relatedArticle.title['en'],
      slug: relatedArticle.slug['en'],
    }));

    const metaTranslations = {
      title: t('Articles.Detail.Meta.Title', { articleTitle: article.title }),
    };

    let hasPurchased = false;
    let articleIsBookmarked = false;

    if (user) {
      if (user.role === 'READER') {
        hasPurchased = await requireUserHasPurchasedItem(user.id, article.id);
      } else {
        hasPurchased = true;
      }

      if (hasPurchased) {
        articleIsBookmarked = await hasBookmarked(user.id, article.id);
      }
    }

    let issuers: Issuer[] = [];
    if (fullArticle.purchasable && !hasPurchased) {
      issuers = await getiDEALIssuers().then((method) => method.issuers);
    }

    return json<ArticleLoaderData>({
      purchasable: fullArticle.purchasable,
      isPurchased: hasPurchased,
      issuers,
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
  const data = useLoaderData<typeof loader>();

  if (data.purchasable && !data.isPurchased) {
    const { article } = data;
    return (
      <PaymentWall
        title={article.title}
        description={article.summary}
        image={article.image}
        issuers={data.issuers}
        purchasePrice={article.purchasePrice}
      />
    );
  }

  const { article, articleIsBookmarked, relatedArticles } = data;

  return (
    <ArticleDetails
      article={article}
      isBookmarked={articleIsBookmarked}
      relatedArticles={relatedArticles}
    />
  );
}
