import type { MetaFunction } from '@remix-run/node';
import { getSummarisedArticles } from '~/models/articles.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ItemCard, { Item } from '~/components/ItemCard';
import { prisma } from '~/db.server';
import { isBefore, parseISO } from 'date-fns';
import { convertArticleOrToolToItem } from '~/utils/content';
import { type SummarisedTool } from '~/types/Tool';

export const meta: MetaFunction = () => [{ title: 'Drakenfruit' }];

export async function loader() {
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

  const items: Item[] = [];
  items.push(
    ...articles.map((item) => convertArticleOrToolToItem(item, 'article'))
  );
  items.push(...tools.map((item) => convertArticleOrToolToItem(item, 'tool')));

  items.sort((a, b) => {
    const aDate = parseISO(a.updatedAt);
    const bDate = parseISO(b.updatedAt);

    return isBefore(aDate, bDate) ? 1 : -1;
  });

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
