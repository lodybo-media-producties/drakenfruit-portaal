import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import {
  commitSession,
  getSession,
  requireUserWithMinimumRole,
} from '~/session.server';
import { prisma } from '~/db.server';
import i18nextServer from '~/i18next.server';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { convertOrganisationListToTableData } from '~/utils/content';
import Button from '~/components/Button';
import Table from '~/components/Table';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('ADMIN', request);

  const organisations = await prisma.organisation.findMany({
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const t = await i18nextServer.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Organisations.Index.Meta.Title'),
  };

  return json({ user, organisations, metaTranslations });
}

export async function action({ request }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  if (request.method !== 'DELETE') {
    return json({ message: 'Method not allowed' }, { status: 405 });
  }

  const t = await i18nextServer.getFixedT(request, 'routes');

  const formData = await request.formData();
  const id = (formData.get('id') as string | undefined) ?? '';

  if (!id) {
    return json<APIResponse>({
      ok: false,
      message: t('Organisations.API.Delete.Error.NoId'),
    });
  } else {
    try {
      await prisma.organisation.delete({
        where: {
          id,
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Organisations.API.DELETE.Success.Title'),
        description: t('Organisations.API.DELETE.Success.Message'),
        destructive: true,
      });

      return json<APIResponse>(
        { ok: true },
        {
          headers: {
            'Set-Cookie': await commitSession(session),
          },
        }
      );
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error);
      return json<APIResponse>({ ok: false, message }, { status: 500 });
    }
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.metaTranslations.title ?? 'Drakenfruit' },
];

export default function OrganisationIndexRoute() {
  const { t } = useTranslation('routes');
  const navigate = useNavigate();
  const { organisations } = useLoaderData<typeof loader>();
  const [columns, data] = convertOrganisationListToTableData(organisations);

  const handleEdit = (id: string) => {
    navigate(`/administratie/organisaties/bewerken/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-4xl">
          {t('Organisations.Index.Title')}
        </h1>

        <Button to="/administratie/organisaties/nieuw">
          {t('Organisations.Index.New Organisation')}
        </Button>
      </div>

      {organisations.length > 0 ? (
        <Table
          columns={columns}
          tableData={data}
          onEdit={handleEdit}
          deletionEndpoint="/administratie/organisaties?index"
          customDeleteMessageKey="Organisations.API.DELETE.Confirmation"
        />
      ) : (
        <p>{t('Organisations.Index.No Organisations')}</p>
      )}
    </div>
  );
}
