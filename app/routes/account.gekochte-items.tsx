import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { requireUser } from '~/session.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18next.server';
import { retrievePurchases } from '~/models/user.server';
import { type SupportedLanguages } from '~/i18n';
import ItemCard, { type Item } from '~/components/ItemCard';
import { isBefore } from 'date-fns';
import { convertArticleOrToolToItem } from '~/utils/content';
import invariant from 'tiny-invariant';
import { type ArticleWithAuthorAndCategories } from '~/types/Article';
import { type SummarisedTool } from '~/types/Tool';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Account.Purchases.Meta.Title'),
  };

  const userPurchases = await retrievePurchases(user.id);

  let purchases: Item[] = [];

  if (userPurchases) {
    userPurchases.purchases.sort((a, b) => {
      return isBefore(a.updatedAt, b.updatedAt) ? 1 : -1;
    });

    purchases = userPurchases.purchases.map((purchase) => {
      if (!purchase.article && !purchase.tool) {
        throw new Error('Purchase has no article or tool');
      }

      const content: ArticleWithAuthorAndCategories | SummarisedTool | null =
        purchase.article || purchase.tool;
      invariant(content, 'Content is null');

      return convertArticleOrToolToItem(
        content,
        purchase.article ? 'article' : 'tool',
        user.locale as SupportedLanguages
      );
    });
  }

  return json({ user, metaTranslations, purchases });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function AccountBoughtItems() {
  const { user, purchases } = useLoaderData<typeof loader>();
  const { t } = useTranslation('routes');

  return (
    <div className="space-y-6">
      <h1 className="font-type text-5xl">
        {t('Account.Purchases.Title', { name: user.firstName })}
      </h1>

      {purchases.length === 0 ? (
        <p className="font-type text-2xl">
          {t('Account.Purchases.No Purchases')}
        </p>
      ) : (
        <div className="max-w-full w-[75vw] mx-auto grid grid-cols-3 gap-3">
          {purchases.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
