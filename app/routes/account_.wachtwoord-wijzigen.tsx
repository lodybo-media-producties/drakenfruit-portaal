import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import invariant from 'tiny-invariant';
import { prisma } from '~/db.server';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import Button from '~/components/Button';
import PasswordInput from '~/components/PasswordInput';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18next.server';
import { validatePasswordChange } from '~/validations/flows';
import { type PasswordChangeErrors } from '~/types/Validations';
import { updatePassword } from '~/models/user.server';
import Message from '~/components/Message';
import Loader from '~/components/Loader';
import { createUserSession } from '~/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Only allow this page to be loaded if the user has to change their password

  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const redirectTo = url.searchParams.get('redirectTo');

  invariant(email, 'Email is required');
  invariant(redirectTo, 'redirectTo is required');

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
    include: {
      password: {
        select: {
          type: true,
        },
      },
    },
  });

  if (!user.password) {
    throw new Error('User has no password');
  }

  const userHasToChangePassword = user.password.type === 'MUSTCHANGE';
  invariant(userHasToChangePassword, 'User does not have to change password');

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Authentication.PasswordChange.Meta.Title'),
  };

  return {
    email,
    redirectTo,
    metaTranslations,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const validationResult = await validatePasswordChange(request);

  if (!validationResult.success) {
    return json<PasswordChangeErrors>(validationResult.errors, { status: 400 });
  } else {
    const { email, redirectTo, newPassword } = validationResult.data;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        password: {
          select: {
            type: true,
          },
        },
      },
    });

    if (!user) {
      return json<PasswordChangeErrors>(
        {
          combi:
            'Deze combinatie van e-mailadres en wachtwoord is niet bekend.',
        },
        { status: 400 }
      );
    }

    if (!user.password) {
      throw new Error(`User ${user.email} has no password`);
    }

    const userHasToChangePassword = user.password.type === 'MUSTCHANGE';
    invariant(userHasToChangePassword, 'User does not have to change password');

    await updatePassword(email, newPassword);

    return createUserSession({
      redirectTo,
      remember: false,
      request,
      userId: user.id,
    });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Wachtwoord wijzigen',
  },
];

export default function ChangePasswordRoute() {
  const { email, redirectTo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();
  const { t } = useTranslation('routes');

  const isSubmitting = navigation.state !== 'idle';

  // http://localhost:3000/account/wachtwoord-wijzigen?email=Birdie_Sipes60@hotmail.com&redirectTo=account
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <h1 className="font-type text-4xl">
            {t('Authentication.PasswordChange.Title')}
          </h1>
          <p>{t('Authentication.PasswordChange.Subtitle')}</p>

          {actionData?.combi ? (
            <Message variant="error" message={actionData.combi} />
          ) : null}

          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <PasswordInput
            label={t('Authentication.PasswordChange.New Password')}
            id="new-password"
            name="new-password"
            autoComplete="new-password"
            error={actionData?.newPassword}
          />

          <PasswordInput
            label={t('Authentication.PasswordChange.Confirm New Password')}
            id="confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            error={actionData?.confirmation}
          />

          <div className="flex flex-row justify-end gap-2">
            {isSubmitting ? <Loader /> : null}
            <Button type="submit" disabled={isSubmitting} primary>
              {t('Authentication.PasswordChange.Change Password Action')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
