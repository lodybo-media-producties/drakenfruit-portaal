import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import Icon from '~/components/Icon';
import LanguageSwitcher from '~/components/LanguageSwitcher';
import { type User } from '~/models/user.server';
import { type ReactNode } from 'react';
import { type IconName } from '@fortawesome/fontawesome-svg-core';
import { Link } from '@remix-run/react';
import { isAllowedForRole } from '~/utils/roles';
import { cn } from '~/lib/utils';

type Props = {
  user?: Omit<User, 'bookmarks' | 'createdAt' | 'updatedAt'>;
};

export default function MainMenu({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Icon name="bars" sizes="l" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {user ? `Hallo ${user.firstName}` : 'Menu'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user ? (
          <>
            <DropdownMenuGroup>
              <MenuItem to="/account" icon="circle-user">
                Account
              </MenuItem>
              <MenuItem to="/account/opgeslagen-items" icon="bookmark">
                Opgeslagen items
              </MenuItem>
              <MenuItem to="/account/instellingen" icon="user-gear">
                Instellingen
              </MenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        ) : null}

        {user && isAllowedForRole('OFFICEMANAGER', user as User) ? (
          <>
            <DropdownMenuGroup>
              <MenuItem to="/administratie/organisaties" icon="building-user">
                Organisaties
              </MenuItem>
              <MenuItem to="/administratie/projecten" icon="folder-open">
                Projecten
              </MenuItem>
              <MenuItem to="/administratie/gebruikers" icon="users">
                Gebruikers
              </MenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <MenuItem to="/administratie/categorieen" icon="tags">
                Categorieën
              </MenuItem>
              <MenuItem to="/administratie/artikelen" icon="file-lines">
                Artikelen
              </MenuItem>
              <MenuItem to="/administratie/tools" icon="file-zipper">
                Tools
              </MenuItem>
              <MenuItem to="/administratie/webinars" icon="file-video">
                Webinars
              </MenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        ) : null}

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LanguageSwitcher mode="large" />
          </DropdownMenuItem>

          {!user ? (
            <MenuItem to="/login" icon="arrow-right-to-bracket">
              Inloggen
            </MenuItem>
          ) : (
            <MenuItem icon="arrow-right-from-bracket" emphasis>
              <form method="post" action="/logout">
                <button>Uitloggen</button>
              </form>
            </MenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type MenuItemProps = {
  to?: string;
  children: ReactNode;
  icon: IconName;
  emphasis?: boolean;
};

function MenuItem({ to, icon, emphasis, children }: MenuItemProps) {
  return (
    <DropdownMenuItem
      className={cn({
        'focus:bg-light-pink': emphasis,
        'text-dark-pink hover:text-black': emphasis,
      })}
    >
      {to ? (
        <Link className="w-full flex flex-row gap-5" to={to}>
          <Icon name={icon} sizes="m" />
          {children}
        </Link>
      ) : (
        <span className="flex flex-row gap-2">
          <Icon name={icon} sizes="m" />
          {children}
        </span>
      )}
    </DropdownMenuItem>
  );
}
