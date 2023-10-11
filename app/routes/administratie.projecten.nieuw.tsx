import { useEffect, useState } from 'react';
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
import { validateProject } from '~/validations/flows';
import { type ProjectErrors } from '~/types/Validations';
import { getErrorMessage } from '~/utils/utils';
import { type APIResponse } from '~/types/Responses';
import { prisma } from '~/db.server';
import ProjectMutationForm from '~/components/ProjectMutationForm';
import { useActionData, useLoaderData } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const organisations = await prisma.organisation.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Projects.New.Meta.Title'),
  };

  return json({
    organisations,
    metaTranslations,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  if (request.method !== 'POST') {
    return json(
      {
        message: t('Projects.API.Error.Invalid Method'),
      },
      {
        status: 405,
      }
    );
  }

  const validationResults = await validateProject(request);

  if (!validationResults.success) {
    return json<ProjectErrors>(validationResults.errors, {
      status: 400,
    });
  } else {
    try {
      await prisma.project.create({
        data: {
          name: validationResults.data.name,
          description: validationResults.data.description,
          organisation: {
            connect: {
              id: validationResults.data.organisationId,
            },
          },
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Projects.API.CREATE.Success.Title'),
        description: t('Projects.API.CREATE.Success.Message'),
      });

      return redirect('/administratie/projecten', {
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
  const { organisations } = useLoaderData<typeof loader>();

  return (
    <ProjectMutationForm
      mode="create"
      organisations={organisations}
      backLink="/administratie/projecten"
      backLinkLabel={t('Projects.New.Back Link Label')}
    />
  );
}
