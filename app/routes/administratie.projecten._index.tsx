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
import {
  convertOrganisationListToTableData,
  convertProjectListToTableData,
} from '~/utils/content';
import Button from '~/components/Button';
import Table from '~/components/Table';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('ADMIN', request);

  const projects = await prisma.project.findMany({
    include: {
      organisation: {
        select: {
          name: true,
        },
      },
      users: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const t = await i18nextServer.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Projects.Index.Meta.Title'),
  };

  return json({ user, projects, metaTranslations });
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
      message: t('Projects.API.Delete.Error.NoId'),
    });
  } else {
    try {
      await prisma.project.delete({
        where: {
          id,
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Projects.API.DELETE.Success.Title'),
        description: t('Projects.API.DELETE.Success.Message'),
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

export default function ProjectsIndexRoute() {
  const { t } = useTranslation('routes');
  const navigate = useNavigate();
  const { projects } = useLoaderData<typeof loader>();
  const [columns, data] = convertProjectListToTableData(projects);

  const handleEdit = (id: string) => {
    navigate(`/administratie/projecten/bewerken/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-4xl">{t('Projects.Index.Title')}</h1>

        <Button to="/administratie/projecten/nieuw">
          {t('Projects.Index.New Project')}
        </Button>
      </div>

      {projects.length > 0 ? (
        <Table
          columns={columns}
          tableData={data}
          onEdit={handleEdit}
          deletionEndpoint="/administratie/projecten?index"
        />
      ) : (
        <p>{t('Projects.Index.No Organisations')}</p>
      )}
    </div>
  );
}
