import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { type FullArticle } from '~/models/articles.server';
import { type SupportedLanguages } from '~/i18n';
import { isBefore } from 'date-fns';
import { convertDateToUTC, formatDate } from '~/utils/utils';
import { Image } from '~/components/Image';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';

type Props = {
  article: FullArticle;
};

export default function ArticleCard({ article }: Props) {
  const { t, i18n } = useTranslation('components');
  const lang = i18n.language as SupportedLanguages;

  let recentDate: string;

  if (isBefore(article.updatedAt, article.createdAt)) {
    recentDate = formatDate(convertDateToUTC(article.createdAt), lang);
  } else {
    recentDate = formatDate(convertDateToUTC(article.updatedAt), lang);
  }

  return (
    <Card className="group cursor-pointer">
      {article.image ? (
        <div className="overflow-hidden w-full h-48">
          <Image
            className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-all duration-300"
            src={article.image}
            alt={article.title[lang]}
          />
        </div>
      ) : null}
      <CardHeader>
        <CardTitle className="text-black group-hover:text-dark-pink transition duration">
          {article.title[lang]}
        </CardTitle>
        <CardDescription>
          {t('ArticleCard.Author', {
            author: `${article.author.firstName} ${article.author.lastName}`,
          })}
          {' | '}
          {recentDate}
          {' | '}
          {article.categories.map((category) => category.name[lang]).join(', ')}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <p className="mb-4">{article.summary[lang]}</p>
        <AnchorLink className="self-end" to={`/articles/${article.slug[lang]}`}>
          {t('ArticleCard.Read More')}{' '}
          <Icon className="ml-0.5" name="arrow-right" />
        </AnchorLink>
      </CardContent>
    </Card>
  );
}
