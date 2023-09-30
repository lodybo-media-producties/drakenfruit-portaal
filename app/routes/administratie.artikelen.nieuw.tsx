import ArticleMutationForm from '~/components/ArticleMutationForm';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import { getUsers } from '~/models/user.server';
import { isAllowedForRole } from '~/utils/roles';
import { type Author } from '~/components/AuthorSelector';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const users = await getUsers();
  const eligibleAuthors: Author[] = users
    .filter((user) => isAllowedForRole('CONSULTANT', user))
    .map(({ id, firstName, lastName }) => ({
      id,
      firstName,
      lastName,
    }));

  return json({ authors: eligibleAuthors, categories: [] });
}

export default function NewArticleRoute() {
  const { t } = useTranslation('routes');
  const { authors, categories } = useLoaderData<typeof loader>();

  return (
    <ArticleMutationForm
      mode="create"
      authors={authors}
      categories={categories}
      backLink="/administratie/artikelen"
      backLinkLabel={t('Articles.New.Back Link Label')}
    />
  );
}
