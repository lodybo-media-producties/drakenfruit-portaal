import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { verifyLogin } from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { validateLogin } from '~/validations/flows';
import type { LoginErrors } from '~/types/Validations';
import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';
import Button from '~/components/Button';
import { Check } from 'lucide-react';
import Checkbox from '~/components/Checkbox';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const validationResult = await validateLogin(request);

  if (!validationResult.success) {
    return json<LoginErrors>(validationResult.errors, { status: 400 });
  } else {
    const { emailaddress, password, remember, redirectTo } =
      validationResult.data;
    const user = await verifyLogin(emailaddress, password);

    if (!user) {
      return json<LoginErrors>(
        {
          userNotFound:
            'Deze combinatie van e-mailadres en wachtwoord is niet bekend.',
        },
        { status: 400 }
      );
    }

    return createUserSession({
      redirectTo,
      remember: remember === 'on',
      request,
      userId: user.id,
    });
  }
};

export const meta: MetaFunction = () => [{ title: 'Login' }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/notes';
  const loginErrors = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <EmailInput
            label="E-mailadres"
            id="email"
            required
            autoFocus={true}
            name="email"
            autoComplete="email"
            error={loginErrors?.emailaddress}
          />

          <PasswordInput
            label="Wachtwoord"
            id="password"
            name="password"
            autoComplete="current-password"
            aria-invalid={loginErrors?.password ? true : undefined}
            aria-describedby="password-error"
            error={loginErrors?.password}
          />

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="flex items-center justify-between">
            <Checkbox name="remember" label="Herinner mij" />

            <Button type="submit">Log mij in</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
