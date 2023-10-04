import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import i18next from '~/i18next.server';
import { useTranslation } from 'react-i18next';
import ToolMutationForm from '~/components/ToolMutationForm';
import { requireUserWithMinimumRole } from '~/session.server';
import { getCategories } from '~/models/categories.server';
import { convertPrismaCategoriesToCategorySelection } from '~/utils/categories';
import { useLoaderData } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const categoryData = await getCategories();
  const categories = convertPrismaCategoriesToCategorySelection(categoryData);

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Tools.New.Meta.Title'),
  };

  return json({
    categories,
    metaTranslations,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function NewToolRoute() {
  const { categories } = useLoaderData<typeof loader>();
  const { t } = useTranslation('routes');

  return (
    <ToolMutationForm
      mode="create"
      categories={categories}
      backLink="/administratie/tools"
      backLinkLabel={t('Tools.New.Back Link Label')}
    />
  );
}
