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
import { validateOrganisation } from '~/validations/flows';
import { type OrganisationErrors } from '~/types/Validations';
import { getErrorMessage } from '~/utils/utils';
import { type APIResponse } from '~/types/Responses';
import { prisma } from '~/db.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Organisations.New.Meta.Title'),
  };

  return json({
    metaTranslations,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('ADMIN', request);

  const t = await i18next.getFixedT(request, 'routes');

  if (request.method !== 'POST') {
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
      await prisma.organisation.create({
        data: {
          name: validationResults.data.name,
          description: validationResults.data.description,
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Organisations.API.CREATE.Success.Title'),
        description: t('Organisations.API.CREATE.Success.Message'),
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

export default function OrganisationsNewRoute() {
  const { t } = useTranslation('routes');

  return (
    <OrganisationMutationForm
      mode="create"
      backLink="/administratie/organisaties"
      backLinkLabel={t('Organisations.New.Back Link Label')}
    />
  );
}
