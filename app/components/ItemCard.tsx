import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { type SupportedLanguages } from '~/i18n';
import { parseISO } from 'date-fns';
import { convertDateToUTC, formatDate } from '~/utils/utils';
import { Image } from '~/components/Image';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';
import { Link } from '@remix-run/react';
import { cn } from '~/lib/utils';

export type Item = {
  type: 'article' | 'tool';
  id: string;
  title: PrismaJson.Translated;
  slug: PrismaJson.Translated;
  summary: PrismaJson.Translated;
  image: string;
  categories: {
    id: string;
    name: PrismaJson.Translated;
    slug: PrismaJson.Translated;
  }[];
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  updatedAt: string;
};

type Props = {
  item: Item;
};

export default function ItemCard({ item }: Props) {
  const { t, i18n } = useTranslation('components');
  const lang = i18n.language as SupportedLanguages;

  console.log(item.updatedAt);
  const recentDate = formatDate(
    convertDateToUTC(parseISO(item.updatedAt)),
    lang
  );

  const getLink = (item: Item) => {
    if (item.type === 'article') {
      const linkArticlePrefix = lang === 'en' ? 'article' : 'artikel';
      return `/${linkArticlePrefix}/${item.slug[lang]}`;
    } else {
      return `/tool/${item.slug[lang]}`;
    }
  };

  return (
    <Card className="relative group cursor-pointer grid grid-cols-1 grid-rows-[repeat(3, minmax(0, auto))] gap-3">
      <span
        className={cn('absolute top-0 right-0 px-2 text-egg-white z-10', {
          'bg-dark-pink': item.type === 'article',
          'bg-dark-blue': item.type === 'tool',
        })}
      >
        {t(
          item.type === 'article'
            ? 'ItemCard.Article Badge'
            : 'ItemCard.Tool Badge'
        )}
      </span>
      {item.image ? (
        <div className="overflow-hidden w-full h-48">
          <Image
            className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-all duration-300"
            src={item.image}
            alt={item.title[lang]}
          />
        </div>
      ) : (
        <div className="h-48" />
      )}
      <CardHeader>
        <CardTitle className="text-black group-hover:text-dark-pink transition duration">
          <Link className="inline-block w-full" to={getLink(item)}>
            {item.title[lang]}
          </Link>
        </CardTitle>
        <CardDescription>
          {item.author ? (
            <>
              {t('ItemCard.Author', {
                author: `${item.author.firstName} ${item.author.lastName}`,
              })}
              {' | '}
            </>
          ) : null}
          {recentDate}
          {item.categories.length ? ' | ' : ''}
          {item.categories.map((category) => category.name[lang]).join(', ')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p>{item.summary[lang]}</p>
      </CardContent>

      <CardFooter className="mt-auto flex flex-col gap-2 h-12">
        <AnchorLink className="self-end" to={getLink(item)}>
          {t('ItemCard.Read More')}{' '}
          <Icon className="ml-0.5" name="arrow-right" />
        </AnchorLink>
      </CardFooter>
    </Card>
  );
}
