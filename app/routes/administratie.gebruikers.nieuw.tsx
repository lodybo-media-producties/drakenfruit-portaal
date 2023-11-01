import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from '@remix-run/node';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/nl';
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
import {
  composeUploadHandlers,
  parseMultipartFormData,
} from '@remix-run/server-runtime/dist/formData';
import { avatarUploadHandler } from '~/models/storage.server';
import { createMemoryUploadHandler } from '@remix-run/server-runtime/dist/upload/memoryUploadHandler';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

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

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Users.New.Meta.Title'),
  };

  return json({
    organisations,
    projects,
    metaTranslations,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  if (request.method !== 'POST') {
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
      const uploadHandler = composeUploadHandlers(
        (args) =>
          avatarUploadHandler({
            ...args,
            callback: () => {},
          }),
        createMemoryUploadHandler()
      );

      const parsedFormData = await parseMultipartFormData(
        request,
        uploadHandler
      );
      const avatarUrl = parsedFormData.get('avatar') as string | undefined;

      const tempPassword = faker.word.words(3);
      const tempPasswordHash = await bcrypt.hash(tempPassword, 10);

      // TODO: Use the createUser function?
      await prisma.user.create({
        data: {
          firstName: validationResults.data.firstName,
          lastName: validationResults.data.lastName,
          email: validationResults.data.email,
          role: validationResults.data.role as Role,
          locale: validationResults.data.locale,
          avatarUrl,
          organisation: {
            connect: {
              id: validationResults.data.organisationId,
            },
          },
          projects: {
            connect: validationResults.data.projectIds.map((projectId) => ({
              id: projectId,
            })),
          },
          password: {
            create: {
              hash: tempPasswordHash,
              type: 'MUSTCHANGE',
            },
          },
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Users.API.CREATE.Success.Title'),
        description: t('Users.API.CREATE.Success.Message'),
      });
      session.flash('modal', {
        title: t('Users.API.CREATE.Success.Pass.Title'),
        description: t('Users.API.CREATE.Success.Pass.Message', {
          password: tempPassword,
        }),
        buttons: [
          {
            label: t('Users.API.CREATE.Success.Pass.Button Label'),
            action: 'close',
          },
        ],
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
  const { organisations, projects } = useLoaderData<typeof loader>();

  return (
    <UserMutationForm
      mode="create"
      organisations={organisations}
      projects={projects}
      backLink="/administratie/gebruikers"
      backLinkLabel={t('Users.New.Back Link Label')}
    />
  );
}
