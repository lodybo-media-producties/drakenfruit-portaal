import { type Role } from '@prisma/client';
import { type ReactNode } from 'react';
import { isAllowedForRole } from '~/utils/roles';
import { type User } from '~/models/user.server';
import { NavLink } from '@remix-run/react';
import Icon, { type Props as IconProps } from '~/components/Icon';

const mainMenuItems: NavItem[] = [
  {
    title: 'Dashboard',
    to: '/account',
    icon: 'circle-user',
  },
  {
    title: 'Mijn gekochte items',
    to: '/account/gekochte-items',
    icon: 'cart-shopping',
    onlyForRoles: ['READER'],
  },
  {
    title: 'Mijn opgeslagen items',
    to: '/account/opgeslagen-items',
    icon: 'bookmark',
  },
  { title: 'Instellingen', to: '/account/instellingen', icon: 'user-gear' },
];

const adminMenuItems: NavItem[] = [
  {
    title: 'Organisaties',
    to: '/administratie/organisaties',
    icon: 'building-user',
  },
  { title: 'Projecten', to: '/administratie/projecten', icon: 'folder-open' },
  { title: 'Gebruikers', to: '/administratie/gebruikers', icon: 'users' },
];

const contentMenuItems: NavItem[] = [
  { title: 'Categorieën', to: '/administratie/categorieen', icon: 'tags' },
  { title: 'Artikelen', to: '/administratie/artikelen', icon: 'file-lines' },
  { title: 'Tools', to: '/administratie/tools', icon: 'file-zipper' },
  { title: 'Webinars', to: '/administratie/webinars', icon: 'file-video' },
];

type Props = {
  user: User;
};

type NavItem = {
  title: string;
  to: string;
  icon: IconProps['name'];
  onlyForRoles?: Role[];
};

type SideNavProps = {
  items: NavItem[];
  userRole?: Role;
};

export default function Sidebar({ user }: Props) {
  return (
    <>
      <AccountMenuTitle>Menu</AccountMenuTitle>

      <SideNav items={mainMenuItems} userRole={user.role} />

      {isAllowedForRole('OFFICEMANAGER', user) ? (
        <>
          <div className="mt-4">
            <AccountMenuTitle>Administratie</AccountMenuTitle>
            <SideNav items={adminMenuItems} userRole={user.role} />
          </div>

          <div className="mt-4">
            <AccountMenuTitle>Content</AccountMenuTitle>
            <SideNav items={contentMenuItems} userRole={user.role} />
          </div>
        </>
      ) : null}
    </>
  );
}

function AccountMenuTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-heading text-egg-white">{children}</h2>;
}

function SideNav({ items, userRole }: SideNavProps) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ title, to, icon, onlyForRoles }) => {
        if (userRole && onlyForRoles && !onlyForRoles.includes(userRole)) {
          return null;
        }

        return (
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
        );
      })}
    </ul>
  );
}
