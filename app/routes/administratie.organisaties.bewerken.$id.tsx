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
import OrganisationMutationForm from '~/components/OrganisationMutationForm';
import invariant from 'tiny-invariant';
import { prisma } from '~/db.server';
import { useLoaderData } from '@remix-run/react';
import { validateOrganisation } from '~/validations/flows';
import { type OrganisationErrors } from '~/types/Validations';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  const { id } = params;
  invariant(id, t('Organisations.Edit.Error.No ID'));

  try {
    const organisation = await prisma.organisation.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const metaTranslations = {
      title: t('Organisations.New.Meta.Title'),
    };

    return json({
      organisation,
      metaTranslations,
    });
  } catch (error) {
    throw new Error(t('Organisations.Edit.Error.Organisation Not Found'));
  }
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  if (request.method !== 'PUT') {
    return json(
      {
        message: t('Organisations.API.Error.Invalid Method'),
      },
      {
        status: 405,
      }
    );
  }

  const validationResults = await validateOrganisation(request);

  if (!validationResults.success) {
    return json<OrganisationErrors>(validationResults.errors, {
      status: 400,
    });
  } else {
    try {
      await prisma.organisation.update({
        where: {
          id: validationResults.data.id,
        },
        data: {
          name: validationResults.data.name,
          description: validationResults.data.description,
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Organisations.API.EDIT.Success.Title'),
        description: t('Organisations.API.EDIT.Success.Message'),
      });

      return redirect('/administratie/organisaties', {
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

export default function OrganisationsEditRoute() {
  const { t } = useTranslation('routes');
  const { organisation } = useLoaderData<typeof loader>();

  return (
    <OrganisationMutationForm
      mode="update"
      initialValues={organisation}
      backLink="/administratie/organisaties"
      backLinkLabel={t('Organisations.New.Back Link Label')}
    />
  );
}
