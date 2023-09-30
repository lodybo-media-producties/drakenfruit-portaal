import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';
import ArticleMutationForm from '~/components/ArticleMutationForm';
import { requireUserWithMinimumRole } from '~/session.server';
import { getUsers } from '~/models/user.server';
import { type Author } from '~/components/AuthorSelector';
import i18next from '~/i18next.server';
import { getArticleById } from '~/models/articles.server';
import { convertPrismaArticleToArticleFormValues } from '~/utils/content';
import { getEligibleAuthors } from '~/utils/users';
import { getCategories } from '~/models/categories.server';
import { convertPrismaCategoriesToCategorySelection } from '~/utils/categories';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('CONSULTANT', request);

  const t = await i18next.getFixedT(request, 'routes');

  const { id } = params;
  invariant(id != null, t('Articles.Edit.Error.No ID'));

  let articleData: Awaited<ReturnType<typeof getArticleById>>;
  try {
    articleData = await getArticleById(id);
  } catch (error) {
    throw new Error(t('Articles.Edit.Error.Article Not Found'));
  }

  const article = convertPrismaArticleToArticleFormValues(articleData);

  const users = await getUsers();
  const eligibleAuthors: Author[] = getEligibleAuthors(users);

  const categoryData = await getCategories();
  const categories = convertPrismaCategoriesToCategorySelection(categoryData);

  const metaTranslations = {
    title: t('Articles.Edit.Meta.Title'),
  };

  return json({
    user,
    article,
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
  const { user, article, authors, categories } = useLoaderData<typeof loader>();

  return (
    <ArticleMutationForm
      mode="update"
      initialValues={article}
      authors={authors}
      categories={categories}
      backLink="/administratie/artikelen"
      backLinkLabel={t('Articles.Edit.Back Link Label')}
      currentUser={user}
    />
  );
}
