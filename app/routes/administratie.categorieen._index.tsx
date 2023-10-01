import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import { requireUserWithMinimumRole } from '~/session.server';
import Button from '~/components/Button';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { convertCategoryListToTableData } from '~/utils/content';
import Table from '~/components/Table';
import { type SupportedLanguages } from '~/i18n';
import i18nextServer from '~/i18next.server';
import { getCategories } from '~/models/categories.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('CONSULTANT', request);

  const categories = await getCategories();

  const t = await i18nextServer.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Categories.Index.Meta.Title'),
  };

  return json({ user, categories, metaTranslations });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.metaTranslations.title ?? 'Drakenfruit' },
];

export default function CategoriesIndexRoute() {
  const { t, i18n } = useTranslation('routes');
  const navigate = useNavigate();
  const { categories } = useLoaderData<typeof loader>();
  const [columns, data] = convertCategoryListToTableData(
    categories,
    i18n.language as SupportedLanguages
  );

  const handleEdit = (id: string) => {
    navigate(`/administratie/categorieen/bewerken/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-4xl">{t('Categories.Index.Title')}</h1>

        <Button to="/administratie/categorieen/nieuw">
          {t('Categories.Index.New Category')}
        </Button>
      </div>

      {categories.length > 0 ? (
        <Table
          columns={columns}
          tableData={data}
          onEdit={handleEdit}
          deletionEndpoint="/api/categories"
        />
      ) : (
        <p>{t('Categories.Index.No Categories')}</p>
      )}
    </div>
  );
}
