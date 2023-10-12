import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { getLocalisedArticleBySlug } from '~/models/articles.server';
import { requireUserWithMinimumRole } from '~/session.server';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import Prose from '~/components/Prose';
import { convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import { Image } from '~/components/Image';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('PROJECTLEADER', request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  try {
    const fullArticle = await getLocalisedArticleBySlug(slug, 'en');
    const article = convertPrismaArticleToLocalisedArticle(fullArticle, 'en');

    return json({ article });
  } catch (error) {
    throw new Error(`Error loading article: ${error}`);
  }
}

export default function DutchArticlePage() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      {article.image ? (
        <Image
          className="h-[30rem] w-full object-cover object-top"
          src={article.image}
          alt={article.title}
        />
      ) : null}
      <div className="h-10" />
      <Prose>
        <h1>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </Prose>
    </div>
  );
}
