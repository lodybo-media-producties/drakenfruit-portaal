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
  convertProjectListToTableData,
  convertUserListToTableData,
} from '~/utils/content';
import Button from '~/components/Button';
import Table from '~/components/Table';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';
import { type UserWithProjectsAndOrgs } from '~/types/User';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('ADMIN', request);

  const users: UserWithProjectsAndOrgs[] = await prisma.user.findMany({
    include: {
      projects: {
        select: {
          id: true,
          name: true,
        },
      },
      organisation: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const t = await i18nextServer.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Users.Index.Meta.Title'),
  };

  return json({ user, users, metaTranslations });
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
      message: t('Users.API.Delete.Error.NoId'),
    });
  } else {
    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Users.API.DELETE.Success.Title'),
        description: t('Users.API.DELETE.Success.Message'),
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
  const { users } = useLoaderData<typeof loader>();
  const [columns, data] = convertUserListToTableData(users);

  const handleEdit = (id: string) => {
    navigate(`/administratie/gebruikers/bewerken/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-4xl">{t('Users.Index.Title')}</h1>

        <Button to="/administratie/gebruikers/nieuw">
          {t('Users.Index.New User')}
        </Button>
      </div>

      {users.length > 0 ? (
        <Table
          columns={columns}
          tableData={data}
          onEdit={handleEdit}
          deletionEndpoint="/administratie/gebruikers?index"
        />
      ) : (
        <p>{t('Users.Index.No Users')}</p>
      )}
    </div>
  );
}
