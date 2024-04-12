import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import invariant from 'tiny-invariant';
import i18next, { detectLocale } from '~/i18next.server';
import { getToolBySlug, type ToolWithCategories } from '~/models/tools.server';
import { getErrorMessage } from '~/utils/utils';
import { useLoaderData } from '@remix-run/react';
import ToolDetails from '~/components/ToolDetails';
import AnchorLink from '~/components/AnchorLink';
import {
  hasBookmarked,
  requireUserHasPurchasedItem,
} from '~/models/user.server';
import PaymentWall from '~/components/PaymentWall';
import { getiDEALIssuers, type Issuer } from '~/payments.server';

interface ToolLoaderData {
  purchased: boolean;
  issuers: Issuer[];
  tool: ToolWithCategories;
  toolIsBookmarked: boolean;
  metaTranslations: {
    title: string;
  };
}

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

    // TODO: Improve flow so that users with a role higher than "READER" always have access to the tool.
    // TODO: Also check whether the tool has a price or not.
    // TODO: Don't fetch issuers if the tool is free or already purchased.
    const hasPurchased = await requireUserHasPurchasedItem(user.id, tool.id);

    let toolIsBookmarked = false;

    let issuers: Issuer[] = [];
    if (hasPurchased) {
      toolIsBookmarked = await hasBookmarked(user.id, tool.id);
    }

    issuers = await getiDEALIssuers().then((method) => method.issuers);

    return json<ToolLoaderData>({
      purchased: hasPurchased,
      issuers,
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
    const { tool } = data;
    return (
      <div className="w-full lg:w-3/4 mx-auto p-12 flex flex-col md:flex-row gap-20">
        <div className="flex flex-col gap-4 w-full lg:w-2/3">
          <h1 className="text-6xl font-type">{tool.name.nl}</h1>
          <p>{tool.description.nl}</p>
          <img src={tool.image} alt={tool.name.nl} />
        </div>

        <div className="w-full lg:w-1/3">
          <PaymentWall
            issuers={data.issuers}
            price={tool.purchasePrice}
            locale="nl"
          />
        </div>
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
