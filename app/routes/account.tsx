import { type ReactNode } from 'react';
import { Outlet, useLoaderData } from '@remix-run/react';
import SideNav, { type NavItem } from '~/components/SideNav';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { requireUser } from '~/session.server';

import { isAllowedForRole } from '~/utils/roles';

const mainMenuItems: NavItem[] = [
  {
    title: 'Mijn opgeslagen artikelen',
    to: '/account/opgeslagen-artikelen',
    icon: 'bookmark',
  },
  { title: 'Instellingen', to: '/account/instellingen', icon: 'sliders' },
];

const adminMenuItems: NavItem[] = [
  { title: 'Organisaties', to: '/admin/organisaties', icon: 'building-user' },
  { title: 'Projecten', to: '/admin/projecten', icon: 'folder-open' },
  { title: 'Gebruikers', to: '/admin/gebruikers', icon: 'users' },
];

const contentMenuItems: NavItem[] = [
  { title: 'Artikelen', to: '/admin/artikelen', icon: 'file-lines' },
  { title: 'Webinars', to: '/admin/webinars', icon: 'file-video' },
  { title: 'Tools', to: '/admin/tools', icon: 'file-zipper' },
];

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
        <AccountMenuTitle>Menu</AccountMenuTitle>

        <SideNav items={mainMenuItems} />

        {isAllowedForRole('OFFICEMANAGER', user) ? (
          <>
            <div className="mt-4">
              <AccountMenuTitle>Administratie</AccountMenuTitle>
              <SideNav items={adminMenuItems} />
            </div>

            <div className="mt-4">
              <AccountMenuTitle>Content</AccountMenuTitle>
              <SideNav items={contentMenuItems} />
            </div>
          </>
        ) : null}
      </div>

      <div className="w-5/6 p-4">
        <Outlet />
      </div>
    </div>
  );
}

function AccountMenuTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-heading text-egg-white">{children}</h2>;
}
