import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import invariant from 'tiny-invariant';
import i18next from '~/i18next.server';
import { getToolBySlug } from '~/models/tools.server';
import { getErrorMessage } from '~/utils/utils';
import { useLoaderData } from '@remix-run/react';
import ToolDetails from '~/components/ToolDetails';
import AnchorLink from '~/components/AnchorLink';
import { type SupportedLanguages } from '~/i18n';
import { hasBookmarked } from '~/models/user.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('PROJECTLEADER', request);

  const { slug } = params;
  invariant(slug, 'slug is required');

  const locale = (await i18next.getLocale(request)) as SupportedLanguages;
  const t = await i18next.getFixedT(request, 'routes');

  try {
    const tool = await getToolBySlug(slug, locale);
    const toolIsBookmarked = await hasBookmarked(user.id, tool.id);

    const metaTranslations = {
      title: t('Tools.Detail.Meta.Title', { toolName: tool.name[locale] }),
    };
    return json({ tool, toolIsBookmarked, metaTranslations });
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
  const { tool, toolIsBookmarked } = useLoaderData<typeof loader>();
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
