import { type convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import { useTranslation } from 'react-i18next';
import { Image } from '~/components/Image';
import AnchorLink from '~/components/AnchorLink';
import Prose from '~/components/Prose';
import { type SerializeFrom } from '@remix-run/node';

type Props = {
  article: SerializeFrom<
    ReturnType<typeof convertPrismaArticleToLocalisedArticle>
  >;
};

export default function ArticleDetails({ article }: Props) {
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
        <h1>{article.title}</h1>
        <div className="flex flex-row gap-2"></div>

        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </Prose>
    </div>
  );
}
