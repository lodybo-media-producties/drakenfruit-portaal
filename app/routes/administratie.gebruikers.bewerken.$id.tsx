import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from '@remix-run/node';
import {
  commitSession,
  getSession,
  requireUserWithMinimumRole,
} from '~/session.server';
import i18next from '~/i18next.server';
import { useTranslation } from 'react-i18next';
import { validateUser } from '~/validations/flows';
import { type UserErrors } from '~/types/Validations';
import { getErrorMessage } from '~/utils/utils';
import { type APIResponse } from '~/types/Responses';
import { prisma } from '~/db.server';
import { useLoaderData } from '@remix-run/react';
import UserMutationForm from '~/components/UserMutationForm';
import { type Role } from '@prisma/client';
import invariant from 'tiny-invariant';
import { type UserFormValues } from '~/types/User';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  const { id } = params;
  invariant(id, t('Users.Edit.Error.No ID'));

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      organisation: {
        select: {
          id: true,
          name: true,
        },
      },
      projects: {
        select: {
          id: true,
        },
      },
    },
  });

  const user: UserFormValues = {
    id: userData.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    avatarUrl: userData.avatarUrl,
    role: userData.role,
    locale: userData.locale,
    organisationId: userData.organisation.id,
    projectIds: userData.projects.map((project) => project.id),
  };

  const organisations = await prisma.organisation.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const metaTranslations = {
    title: t('Users.Edit.Meta.Title'),
  };

  return json({
    user,
    organisations,
    projects,
    metaTranslations,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  if (request.method !== 'PUT') {
    return json(
      {
        message: t('Users.API.Error.Invalid Method'),
      },
      {
        status: 405,
      }
    );
  }

  const validationResults = await validateUser(request);

  if (!validationResults.success) {
    return json<UserErrors>(validationResults.errors, {
      status: 400,
    });
  } else {
    try {
      await prisma.user.update({
        where: {
          id: validationResults.data.id,
        },
        data: {
          firstName: validationResults.data.firstName,
          lastName: validationResults.data.lastName,
          email: validationResults.data.email,
          role: validationResults.data.role as Role,
          locale: validationResults.data.locale,
          organisation: {
            connect: {
              id: validationResults.data.organisationId,
            },
          },
          projects: {
            set: validationResults.data.projectIds.map((projectId) => ({
              id: projectId,
            })),
          },
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Users.API.UPDATE.Success.Title'),
        description: t('Users.API.UPDATE.Success.Message'),
      });

      return redirect('/administratie/gebruikers', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    } catch (error) {
      const message = getErrorMessage(error);

      return json<APIResponse>(
        {
          ok: false,
          message,
        },
        {
          status: 500,
        }
      );
    }
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function ProjectsNewRoute() {
  const { t } = useTranslation('routes');
  const { user, organisations, projects } = useLoaderData<typeof loader>();

  return (
    <UserMutationForm
      mode="update"
      initialValues={user}
      organisations={organisations}
      projects={projects}
      backLink="/administratie/gebruikers"
      backLinkLabel={t('Users.New.Back Link Label')}
    />
  );
}
