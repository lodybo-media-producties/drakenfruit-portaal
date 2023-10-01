import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';
import CategoryMutationForm from '~/components/CategoryMutationForm';
import { requireUserWithMinimumRole } from '~/session.server';
import { getUsers } from '~/models/user.server';
import { type Author } from '~/components/AuthorSelector';
import i18next from '~/i18next.server';
import { getCategoryById } from '~/models/categories.server';
import { convertCategoryFormValuesToFormData } from '~/utils/content';
import { getEligibleAuthors } from '~/utils/users';
import { convertPrismaCategoriesToCategorySelection } from '~/utils/categories';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('CONSULTANT', request);

  const t = await i18next.getFixedT(request, 'routes');

  const { id } = params;
  invariant(id != null, t('Categories.Edit.Error.No ID'));

  try {
    const categories = await getCategoryById(id);

    const metaTranslations = {
      title: t('Categories.Edit.Meta.Title'),
    };

    return json({
      user,
      categories,
      metaTranslations,
    });
  } catch (error) {
    throw new Error(t('Categories.Edit.Error.Category Not Found'));
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function NewCategoryRoute() {
  const { t } = useTranslation('routes');
  const { categories } = useLoaderData<typeof loader>();

  return (
    <CategoryMutationForm
      mode="update"
      initialValues={categories}
      backLink="/administratie/categories"
      backLinkLabel={t('Categories.Edit.Back Link Label')}
    />
  );
}
