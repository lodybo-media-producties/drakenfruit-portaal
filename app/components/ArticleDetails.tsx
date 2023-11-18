import { type convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import { useTranslation } from 'react-i18next';
import { Image } from '~/components/Image';
import AnchorLink from '~/components/AnchorLink';
import Prose from '~/components/Prose';
import { type SerializeFrom } from '@remix-run/node';
import ContentMeta from '~/components/ContentMeta';
import BookmarkIndicator from '~/components/BookmarkIndicator';

type Props = {
  article: SerializeFrom<
    ReturnType<typeof convertPrismaArticleToLocalisedArticle>
  >;
  isBookmarked: boolean;
};

export default function ArticleDetails({ article, isBookmarked }: Props) {
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

      <div className="w-3/4 mx-auto py-8">
        <AnchorLink to="/">{t('ArticleDetails.Back Link Label')}</AnchorLink>
      </div>

      <Prose>
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="not-prose text-7xl">{article.title}</h1>
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
        </div>

        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </Prose>
    </div>
  );
}
