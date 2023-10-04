import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import i18nextServer from '~/i18next.server';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { convertToolListToTableData } from '~/utils/content';
import { type SupportedLanguages } from '~/i18n';
import { getToolsWithCategories } from '~/models/tools.server';
import Button from '~/components/Button';
import Table from '~/components/Table';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const tools = await getToolsWithCategories();

  const t = await i18nextServer.getFixedT(request, 'routes');

  const metaTranslations = {
    title: t('Tools.Index.Meta.Title'),
  };

  return json({ tools, metaTranslations });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.metaTranslations.title ?? 'Drakenfruit' },
];

export default function ToolsIndexRoute() {
  const { t, i18n } = useTranslation('routes');
  const navigate = useNavigate();
  const { tools } = useLoaderData<typeof loader>();
  const [columns, data] = convertToolListToTableData(
    tools,
    i18n.language as SupportedLanguages
  );

  const handleEdit = (id: string) => {
    navigate(`/administratie/tools/bewerken/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-4xl">{t('Tools.Index.Title')}</h1>

        <Button to="/administratie/tools/nieuw">
          {t('Tools.Index.New Tool')}
        </Button>
      </div>

      {tools.length > 0 ? (
        <Table
          columns={columns}
          tableData={data}
          onEdit={handleEdit}
          deletionEndpoint="/api/tools"
        />
      ) : (
        <p>{t('Tools.Index.No Tools')}</p>
      )}
    </div>
  );
}
