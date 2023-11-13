// import logo from '~/assets/images/logo/horizontal-icon-name-smaller.png';
import { Image } from '~/components/Image';
import Icon from '~/components/Icon';
import type { User } from '~/models/user.server';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Button from '~/components/Button';
import LanguageSwitcher from '~/components/LanguageSwitcher';
import MainMenu from '~/components/MainMenu';

type Props = {
  user?: User;
};

export default function Header({ user }: Props) {
  return (
    <div className="bg-light-blue flex flex-row justify-between gap-2.5 pl-5 pr-12 py-2.5">
      <div className="w-5/6 sm:w-2/6">
        <Link to="/">
          <Image
            src="/image/logo/horizontal-icon-name-smaller.png?root=public"
            srcSet={`
          /image/logo/horizontal-icon-name-smaller.png?root=public&w=200w 200w,
          /image/logo/horizontal-icon-name-smaller.png?root=public&w=400w 400w,
          /image/logo/horizontal-icon-name-smaller.png?root=public&w=600w 600w,
          /image/logo/horizontal-icon-name-smaller.png?root=public&w=800w 800w,
          /image/logo/horizontal-icon-name-smaller.png?root=public&w=1200w 1200w,
        `}
            sizes="
          (max-width: 400px) 200px,
          (max-width: 800px) 400px,
          (max-width: 1200px) 600px
          (max-width: 1920px) 800px
        "
            alt="Drakenfruit logo"
          />
        </Link>
      </div>

      <div className="w-1/6 flex justify-center items-center gap-2.5">
        <MainMenu user={user} />
      </div>
    </div>
  );
}
