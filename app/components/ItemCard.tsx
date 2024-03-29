import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { type SupportedLanguages } from '~/i18n';
import { Image } from '~/components/Image';
import Icon from '~/components/Icon';
import { Link } from '@remix-run/react';
import { cn } from '~/lib/utils';
import ContentMeta from '~/components/ContentMeta';

export type Item = {
  type: 'article' | 'tool';
  isBookmarked?: boolean;
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
  createdAt: string;
  updatedAt: string;
};

type Props = {
  item: Item;
};

export default function ItemCard({ item }: Props) {
  const { t, i18n } = useTranslation('components');
  const lang = i18n.language as SupportedLanguages;

  const getLink = (item: Item) => {
    if (item.type === 'article') {
      const linkArticlePrefix = lang === 'en' ? 'article' : 'artikel';
      return `/${linkArticlePrefix}/${item.slug[lang]}`;
    } else {
      return `/tool/${item.slug[lang]}`;
    }
  };

  return (
    <Link className="block h-full" to={getLink(item)}>
      <Card className="relative group cursor-pointer grid grid-cols-1 grid-rows-[repeat(3, minmax(0, auto))] gap-3 h-full">
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
        {item.isBookmarked !== undefined ? (
          <div
            className={cn(
              'absolute top-0 left-0 px-2 py-0 z-10 text-egg-white',
              {
                'bg-dark-pink': item.type === 'article',
                'bg-dark-blue': item.type === 'tool',
              }
            )}
          >
            <Icon name="bookmark" prefix={item.isBookmarked ? 'fas' : 'far'} />
          </div>
        ) : null}
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
            {item.title[lang]}
          </CardTitle>
          <ContentMeta
            author={item.author}
            categories={item.categories}
            createdAt={item.createdAt}
            updatedAt={item.updatedAt}
          />
        </CardHeader>

        <CardContent>
          <p>{item.summary[lang]}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
