import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireUserWithMinimumRole } from '~/session.server';
import AccountLayout from '~/layouts/account';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithMinimumRole('ADMIN', request);

  return json({ user });
}

export default function ProjectsRoute() {
  const { user } = useLoaderData<typeof loader>();

  return <AccountLayout user={user} />;
}
