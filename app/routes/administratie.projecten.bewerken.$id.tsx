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
import invariant from 'tiny-invariant';
import { prisma } from '~/db.server';
import { useLoaderData } from '@remix-run/react';
import { validateProject } from '~/validations/flows';
import { type ProjectErrors } from '~/types/Validations';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';
import ProjectMutationForm from '~/components/ProjectMutationForm';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  const { id } = params;
  invariant(id, t('Projects.Edit.Error.No ID'));

  try {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const organisations = await prisma.organisation.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const metaTranslations = {
      title: t('Projects.New.Meta.Title'),
    };

    return json({
      project,
      organisations,
      metaTranslations,
    });
  } catch (error) {
    throw new Error(t('Projects.Edit.Error.Project Not Found'));
  }
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  if (request.method !== 'PUT') {
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
      await prisma.project.update({
        where: {
          id: validationResults.data.id,
        },
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
        title: t('Projects.API.EDIT.Success.Title'),
        description: t('Projects.API.EDIT.Success.Message'),
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

export default function ProjectsEditRoute() {
  const { t } = useTranslation('routes');
  const { project, organisations } = useLoaderData<typeof loader>();

  return (
    <ProjectMutationForm
      mode="update"
      initialValues={project}
      organisations={organisations}
      backLink="/administratie/projecten"
      backLinkLabel={t('Projects.New.Back Link Label')}
    />
  );
}
