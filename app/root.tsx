import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import { getUser } from '~/session.server';
import stylesheet from '~/tailwind.css';
import Header from '~/components/Header';
import i18next from '~/i18next.server';
import { useChangeLanguage } from 'remix-i18next';
import { useTranslation } from 'react-i18next';
import { useOptionalUser } from '~/utils/utils';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  return json({ user: await getUser(request), locale });
};

export default function App() {
  const user = useOptionalUser();
  // Get the locale from the loader
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html className="h-full" lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full font-body bg-egg-white">
        <Header user={user} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const handle = {
  i18n: 'common',
};
