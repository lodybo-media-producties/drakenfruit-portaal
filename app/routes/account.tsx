import { Outlet, useLoaderData } from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUser } from '~/session.server';
import Sidebar from '~/components/Sidebar';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return json({ user });
}

export const meta: MetaFunction = () => [
  { title: 'Account | Drakenfruit', description: 'Account' },
];

export default function AccountLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-row gap-0 w-full h-full">
      <div className="w-1/6 bg-light-blue p-4">
        <Sidebar user={user} />
      </div>

      <div className="w-5/6 p-4">
        <Outlet />
      </div>
    </div>
  );
}
