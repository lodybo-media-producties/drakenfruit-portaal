import ArticleMutationForm from '~/components/ArticleMutationForm';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import { getUsers } from '~/models/user.server';
import { isAllowedForRole } from '~/utils/roles';
import { type Author } from '~/components/AuthorSelector';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18next.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('CONSULTANT', request);

  const users = await getUsers();
  const eligibleAuthors: Author[] = users
    .filter((user) => isAllowedForRole('CONSULTANT', user))
    .map(({ id, firstName, lastName }) => ({
      id,
      firstName,
      lastName,
    }));

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Articles.New.Meta.Title'),
  };

  return json({
    user,
    authors: eligibleAuthors,
    categories: [],
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
