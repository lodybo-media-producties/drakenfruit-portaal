import { type convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import { useTranslation } from 'react-i18next';
import { Image } from '~/components/Image';
import AnchorLink from '~/components/AnchorLink';
import Prose from '~/components/Prose';
import { type SerializeFrom } from '@remix-run/node';
import ContentMeta from '~/components/ContentMeta';
import BookmarkIndicator from '~/components/BookmarkIndicator';
import { type SerializedArticle } from '~/models/articles.server';
import { type LocalisedArticle } from '~/types/Article';

type Props = {
  article: SerializeFrom<
    ReturnType<typeof convertPrismaArticleToLocalisedArticle>
  >;
  isBookmarked: boolean;
  relatedArticles: Pick<
    LocalisedArticle<SerializedArticle>,
    'id' | 'title' | 'slug'
  >[];
};

export default function ArticleDetails({
  article,
  isBookmarked,
  relatedArticles,
}: Props) {
  const { t } = useTranslation('components');

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

      <div className="flex flex-row gap-2 px-4 mt-16">
        <div className="w-3/4">
          <Prose>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-4">
                <ContentMeta
                  author={article.author}
                  categories={article.categories}
                  createdAt={article.createdAt}
                  updatedAt={article.updatedAt}
                />

                <BookmarkIndicator
                  bookmarked={isBookmarked}
                  bookmarkID={article.id}
                />
              </div>
              <h1>{article.title}</h1>
            </div>

            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </Prose>
        </div>

        <div className="w-1/4 relative">
          {relatedArticles.length === 0 ? null : (
            <div className="sticky top-8 mt-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl">
                  {t('ArticleDetails.Related Articles')}
                </h2>
                <ul className="flex flex-col gap-2">
                  {relatedArticles.map((article) => (
                    <li key={article.id}>
                      <AnchorLink to={`/articles/${article.slug}`}>
                        {article.title}
                      </AnchorLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
