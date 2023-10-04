import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import i18next from '~/i18next.server';
import invariant from 'tiny-invariant';
import { getToolByID } from '~/models/tools.server';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from '@remix-run/react';
import ToolMutationForm from '~/components/ToolMutationForm';
import { getCategories } from '~/models/categories.server';
import { convertPrismaCategoriesToCategorySelection } from '~/utils/categories';
import { convertPrismaToolDataToToolFormValues } from '~/utils/content';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const t = await i18next.getFixedT(request, 'routes');

  const { id } = params;
  invariant(id != null, t('Tools.Edit.Error.No ID'));

  let toolData: Awaited<ReturnType<typeof getToolByID>>;
  try {
    toolData = await getToolByID(id);
  } catch (error) {
    throw new Error(t('Tools.Edit.Error.Tool Not Found'));
  }

  const tool = convertPrismaToolDataToToolFormValues(toolData);

  const categoryData = await getCategories();
  const categories = convertPrismaCategoriesToCategorySelection(categoryData);

  const metaTranslations = {
    title: t('Tools.Edit.Meta.Title'),
  };

  return json({
    tool,
    categories,
    metaTranslations,
  });
}

export default function EditToolRoute() {
  const { t } = useTranslation('routes');
  const { tool, categories } = useLoaderData<typeof loader>();

  return (
    <ToolMutationForm
      mode="update"
      initialValues={tool}
      categories={categories}
      backLink="/administratie/tools"
      backLinkLabel={t('Tools.Edit.Back Link Label')}
    />
  );
}
