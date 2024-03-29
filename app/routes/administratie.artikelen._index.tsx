import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import { requireUserWithMinimumRole } from '~/session.server';
import { getArticlesSummaryList } from '~/models/articles.server';
import Button from '~/components/Button';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { convertArticleListToTableData } from '~/utils/content';
import Table from '~/components/Table';
import { type SupportedLanguages } from '~/i18n';
import i18nextServer from '~/i18next.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('CONSULTANT', request);

  const articles = await getArticlesSummaryList();

  const t = await i18nextServer.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Articles.Index.Meta.Title'),
  };

  return json({ user, articles, metaTranslations });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.metaTranslations.title ?? 'Drakenfruit' },
];

export default function ArticlesIndexRoute() {
  const { t, i18n } = useTranslation('routes');
  const navigate = useNavigate();
  const { articles } = useLoaderData<typeof loader>();
  const [columns, data] = convertArticleListToTableData(
    articles,
    i18n.language as SupportedLanguages
  );

  const handleEdit = (id: string) => {
    navigate(`/administratie/artikelen/bewerken/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-4xl">{t('Articles.Index.Title')}</h1>

        <Button to="/administratie/artikelen/nieuw">
          {t('Articles.Index.New Article')}
        </Button>
      </div>

      {articles.length > 0 ? (
        <Table
          columns={columns}
          tableData={data}
          onEdit={handleEdit}
          deletionEndpoint="/api/articles"
        />
      ) : (
        <p>{t('Articles.Index.No Articles')}</p>
      )}
    </div>
  );
}
