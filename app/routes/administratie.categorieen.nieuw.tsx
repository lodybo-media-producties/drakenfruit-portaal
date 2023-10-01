import { useTranslation } from 'react-i18next';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import i18next from '~/i18next.server';
import CategoryMutationForm from '~/components/CategoryMutationForm';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Categories.New.Meta.Title'),
  };

  return json({
    metaTranslations,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function NewCategoryRoute() {
  const { t } = useTranslation('routes');

  return (
    <CategoryMutationForm
      mode="create"
      backLink="/administratie/categories"
      backLinkLabel={t('Categories.New.Back Link Label')}
    />
  );
}
