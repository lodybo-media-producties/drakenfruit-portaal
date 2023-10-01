import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireAdmin } from '~/session.server';
import AccountLayout from '~/layouts/account';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAdmin(request);

  return json({ user });
}

export default function ArticlesRoute() {
  const { user } = useLoaderData<typeof loader>();

  return <AccountLayout user={user} />;
}
