import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { type SummarisedArticle } from '~/models/articles.server';
import { type SupportedLanguages } from '~/i18n';
import { isBefore, parseISO } from 'date-fns';
import { convertDateToUTC, formatDate } from '~/utils/utils';
import { Image } from '~/components/Image';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';
import { type SerializeFrom } from '@remix-run/server-runtime';

type Props = {
  article: SerializeFrom<SummarisedArticle>;
};

export default function ArticleCard({ article }: Props) {
  const { t, i18n } = useTranslation('components');
  const lang = i18n.language as SupportedLanguages;

  let recentDate: string;

  const updatedAtDate = parseISO(article.updatedAt);
  const createdAtDate = parseISO(article.createdAt);
  if (isBefore(updatedAtDate, createdAtDate)) {
    recentDate = formatDate(convertDateToUTC(createdAtDate), lang);
  } else {
    recentDate = formatDate(convertDateToUTC(updatedAtDate), lang);
  }

  return (
    <Card className="group cursor-pointer grid grid-cols-1 grid-rows-[repeat(3, minmax(0, auto))] gap-3">
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

      <CardContent>
        <p>{article.summary[lang]}</p>
      </CardContent>

      <CardFooter className="mt-auto flex flex-col gap-2 h-12">
        <AnchorLink className="self-end" to={`/articles/${article.slug[lang]}`}>
          {t('ArticleCard.Read More')}{' '}
          <Icon className="ml-0.5" name="arrow-right" />
        </AnchorLink>
      </CardFooter>
    </Card>
  );
}
