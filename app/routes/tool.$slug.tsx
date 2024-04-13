import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { getUser } from '~/session.server';
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
import { getiDEALIssuers, type Issuer } from '~/payments.server';
import PaymentWall from '~/components/PaymentWall';
import { useTranslation } from 'react-i18next';

interface ToolLoaderData {
  purchasable: boolean;
  isPurchased: boolean;
  issuers: Issuer[];
  tool: ToolWithCategories;
  toolIsBookmarked: boolean;
  metaTranslations: {
    title: string;
  };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await getUser(request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  const locale = await detectLocale(request, user);

  const t = await i18next.getFixedT(request, 'routes');

  try {
    const tool = await getToolBySlug(slug, locale);
    const metaTranslations = {
      title: t('Tools.Detail.Meta.Title', { toolName: tool.name[locale] }),
    };

    let hasPurchased = false;
    let toolIsBookmarked = false;

    if (user) {
      if (user.role === 'READER') {
        hasPurchased = await requireUserHasPurchasedItem(user.id, tool.id);
      } else {
        hasPurchased = true;
      }

      if (hasPurchased) {
        toolIsBookmarked = await hasBookmarked(user.id, tool.id);
      }
    }

    let issuers: Issuer[] = [];
    if (tool.purchasable && !hasPurchased) {
      issuers = await getiDEALIssuers().then((method) => method.issuers);
    }

    return json<ToolLoaderData>({
      purchasable: tool.purchasable,
      isPurchased: hasPurchased,
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
  const { i18n } = useTranslation('components');
  if (data.purchasable && !data.isPurchased) {
    const getTranslatedValue = (key: PrismaJson.Translated): string => {
      if (i18n.language === 'nl') {
        return key.nl;
      }

      return key.en;
    };

    const { tool } = data;
    return (
      <PaymentWall
        title={getTranslatedValue(tool.name)}
        description={getTranslatedValue(tool.description)}
        image={tool.image}
        purchasePrice={data.tool.purchasePrice}
        issuers={data.issuers}
      />
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
