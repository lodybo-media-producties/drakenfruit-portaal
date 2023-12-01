import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { getSummarisedArticles } from '~/models/articles.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ItemCard, { type Item } from '~/components/ItemCard';
import { prisma } from '~/db.server';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { convertArticleOrToolToItem } from '~/utils/content';
import { type SummarisedTool } from '~/types/Tool';
import i18next from '~/i18next.server';
import { type SupportedLanguages } from '~/i18n';
import { getUser } from '~/session.server';

export const meta: MetaFunction = () => [{ title: 'Drakenfruit' }];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);

  // TODO: implement streaming maybe?
  const articles = await getSummarisedArticles();
  const tools: SummarisedTool[] = await prisma.tool.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      image: true,
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  const locale = (await i18next.getLocale(request)) as SupportedLanguages;

  const content = [
    ...articles.map((article) => ({
      ...article,
      type: 'article',
    })),
    ...tools.map((tool) => ({
      ...tool,
      type: 'tool',
    })),
  ];

  content.sort((a, b) => {
    return isBefore(a.updatedAt, b.updatedAt) ? 1 : -1;
  });

  const items: Item[] = [];

  items.push(
    ...content.map((item) =>
      convertArticleOrToolToItem(item, item.type as 'tool' | 'article', locale)
    )
  );

  if (user) {
    items.forEach((item) => {
      item.isBookmarked = user.bookmarks.includes(item.id);
    });
  }

  return json({ items });
}

export default function Index() {
  const { items } = useLoaderData<typeof loader>();

  return (
    <div className="px-8 pt-12">
      <div className="max-w-full w-[75vw] mx-auto grid grid-cols-3 gap-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
