import { useLoaderData } from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUser } from '~/session.server';
import AccountLayout from '~/layouts/account';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return json({ user });
}

export const meta: MetaFunction = () => [
  { title: 'Account | Drakenfruit', description: 'Account' },
];

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();

  return <AccountLayout user={user} />;
}
