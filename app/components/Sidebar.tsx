import { type ReactNode } from 'react';
import { isAllowedForRole } from '~/utils/roles';
import { type User } from '~/models/user.server';
import { NavLink, useLocation } from '@remix-run/react';
import Icon, { type Props as IconProps } from '~/components/Icon';

const mainMenuItems: NavItem[] = [
  {
    title: 'Dashboard',
    to: '/account',
    icon: 'circle-user',
  },
  {
    title: 'Mijn opgeslagen artikelen',
    to: '/account/opgeslagen-artikelen',
    icon: 'bookmark',
  },
  { title: 'Instellingen', to: '/account/instellingen', icon: 'user-gear' },
];

const adminMenuItems: NavItem[] = [
  { title: 'Organisaties', to: '/admin/organisaties', icon: 'building-user' },
  { title: 'Projecten', to: '/admin/projecten', icon: 'folder-open' },
  { title: 'Gebruikers', to: '/admin/gebruikers', icon: 'users' },
];

const contentMenuItems: NavItem[] = [
  { title: 'Artikelen', to: '/administratie/artikelen', icon: 'file-lines' },
  { title: 'Webinars', to: '/administratie/webinars', icon: 'file-video' },
  { title: 'Tools', to: '/administratie/tools', icon: 'file-zipper' },
];

type Props = {
  user: User;
};

type NavItem = {
  title: string;
  to: string;
  icon: IconProps['name'];
};

type SideNavProps = {
  items: NavItem[];
  currentPath: string;
};

export default function Sidebar({ user }: Props) {
  const location = useLocation();

  return (
    <>
      <AccountMenuTitle>Menu</AccountMenuTitle>

      <SideNav items={mainMenuItems} currentPath={location.pathname} />

      {isAllowedForRole('OFFICEMANAGER', user) ? (
        <>
          <div className="mt-4">
            <AccountMenuTitle>Administratie</AccountMenuTitle>
            <SideNav items={adminMenuItems} currentPath={location.pathname} />
          </div>

          <div className="mt-4">
            <AccountMenuTitle>Content</AccountMenuTitle>
            <SideNav items={contentMenuItems} currentPath={location.pathname} />
          </div>
        </>
      ) : null}
    </>
  );
}

function AccountMenuTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-heading text-egg-white">{children}</h2>;
}

function SideNav({ items, currentPath }: SideNavProps) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ title, to, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `
            flex
            flex-row
            gap-2
            transition-all
            py-0.5
            ${isActive ? 'pl-2 hover:pl-2.5' : 'pl-0 hover:pl-1'}
            ${
              isActive
                ? 'bg-dark-blue text-egg-white'
                : 'transparent text-neutral-700 hover:text-neutral-900'
            }
          `}
          end
        >
          <Icon faClasses="fa-fw" name={icon} />
          {title}
        </NavLink>
      ))}
    </ul>
  );
}
