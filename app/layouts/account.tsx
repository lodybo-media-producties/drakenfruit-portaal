import { Outlet } from '@remix-run/react';
import { type User } from '~/models/user.server';
import Sidebar from '~/components/Sidebar';

type Props = {
  user: User;
};

export default function AccountLayout({ user }: Props) {
  return (
    <div className="flex flex-row gap-0 w-full h-full">
      <div className="w-1/6 bg-light-blue p-4">
        <Sidebar user={user} />
      </div>

      <div className="w-5/6 p-12">
        <Outlet />
      </div>
    </div>
  );
}
