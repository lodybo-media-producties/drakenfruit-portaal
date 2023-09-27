import { Link } from '@remix-run/react';
import Icon, { type Props as IconProps } from '~/components/Icon';

export type NavItem = {
  title: string;
  to: string;
  icon: IconProps['name'];
};

type Props = {
  items: NavItem[];
};

export default function SideNav({ items }: Props) {
  return (
    <ul className="space-y-0">
      {items.map((item) => (
        <NavigationItem key={item.to} {...item} />
      ))}
    </ul>
  );
}

function NavigationItem({ title, to, icon }: NavItem) {
  return (
    <li>
      <Link
        className="flex flex-row gap-2 text-neutral-700 transition-all hover:gap-3 hover:text-neutral-900"
        to={to}
      >
        <Icon faClasses="fa-fw" name={icon} />
        {title}
      </Link>
    </li>
  );
}
