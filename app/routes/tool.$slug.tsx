import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import invariant from 'tiny-invariant';
import i18next, { detectLocale } from '~/i18next.server';
import { getToolBySlug } from '~/models/tools.server';
import { getErrorMessage } from '~/utils/utils';
import { useLoaderData } from '@remix-run/react';
import ToolDetails from '~/components/ToolDetails';
import AnchorLink from '~/components/AnchorLink';
import {
  hasBookmarked,
  requireUserHasPurchasedItem,
} from '~/models/user.server';

interface BasePurchasedData {
  purchased: boolean;
}

interface NonPurchasedData extends BasePurchasedData {
  purchased: false;
  metaTranslations: {
    title: string;
  };
}

interface PurchasedData extends BasePurchasedData {
  purchased: true;
  tool: any;
  toolIsBookmarked: boolean;
  metaTranslations: {
    title: string;
  };
}

type ToolLoaderData = NonPurchasedData | PurchasedData;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('READER', request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  const locale = await detectLocale(request, user);

  const t = await i18next.getFixedT(request, 'routes');

  try {
    const tool = await getToolBySlug(slug, locale);
    const metaTranslations = {
      title: t('Tools.Detail.Meta.Title', { toolName: tool.name[locale] }),
    };

    const hasPurchased = await requireUserHasPurchasedItem(user.id, tool.id);

    if (!hasPurchased) {
      return json<ToolLoaderData>({
        purchased: false,
        metaTranslations,
      });
    }

    const toolIsBookmarked = await hasBookmarked(user.id, tool.id);

    return json<ToolLoaderData>({
      purchased: true,
      tool,
      toolIsBookmarked,
      metaTranslations,
    });
  } catch (error) {
    throw new Error(`Error loading tool: ${getErrorMessage(error)}`);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function ToolPage() {
  const data = useLoaderData<typeof loader>();
  if (!data.purchased) {
    return (
      <div className="w-full">
        <p className="font-type text-2xl">Je hebt dit item nog niet gekocht.</p>
      </div>
    );
  }

  const { tool, toolIsBookmarked } = data;

  return (
    <div className="w-full">
      <ToolDetails
        tool={tool}
        backLink={<AnchorLink to="/">Terug</AnchorLink>}
        isBookmarked={toolIsBookmarked}
      />
    </div>
  );
}
