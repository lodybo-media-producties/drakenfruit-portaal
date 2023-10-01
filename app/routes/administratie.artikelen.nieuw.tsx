import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import ArticleMutationForm from '~/components/ArticleMutationForm';
import { requireUserWithMinimumRole } from '~/session.server';
import { getUsers } from '~/models/user.server';
import { type Author } from '~/components/AuthorSelector';
import i18next from '~/i18next.server';
import { getEligibleAuthors } from '~/utils/users';
import { getCategories } from '~/models/categories.server';
import { convertPrismaCategoriesToCategorySelection } from '~/utils/categories';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('CONSULTANT', request);

  const users = await getUsers();
  const eligibleAuthors: Author[] = getEligibleAuthors(users);

  const categoryData = await getCategories();
  const categories = convertPrismaCategoriesToCategorySelection(categoryData);

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Articles.New.Meta.Title'),
  };

  return json({
    user,
    authors: eligibleAuthors,
    categories,
    metaTranslations,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function NewArticleRoute() {
  const { t } = useTranslation('routes');
  const { user, authors, categories } = useLoaderData<typeof loader>();

  return (
    <ArticleMutationForm
      mode="create"
      authors={authors}
      categories={categories}
      backLink="/administratie/artikelen"
      backLinkLabel={t('Articles.New.Back Link Label')}
      currentUser={user}
    />
  );
}
