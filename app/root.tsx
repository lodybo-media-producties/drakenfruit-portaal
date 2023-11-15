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
  useRouteError,
} from '@remix-run/react';

import { commitSession, getSession, getUser } from '~/session.server';
import stylesheet from '~/tailwind.css';
import Header from '~/components/Header';
import i18next from '~/i18next.server';
import { useChangeLanguage } from 'remix-i18next';
import { useTranslation } from 'react-i18next';
import { getErrorMessage, useOptionalUser } from '~/utils/utils';
import { langSessionCookie } from '~/cookies.server';
import { Toaster } from '~/components/ui/toaster';
import { useEffect } from 'react';
import { useToast } from '~/components/ui/use-toast';
import Footer from '~/components/Footer';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);
  const toasterData = session.get('toast') || null;

  const headers = new Headers();
  headers.set('Set-Cookie', await langSessionCookie.serialize('nl'));
  headers.set('Set-Cookie', await commitSession(session));

  const locale = await i18next.getLocale(request);
  return json(
    { user: await getUser(request), locale, toasterData },
    {
      headers,
    }
  );
};

export default function App() {
  const user = useOptionalUser();
  // Get the locale from the loader
  const { locale, toasterData } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  const { toast } = useToast();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  useEffect(() => {
    if (toasterData) {
      toast({
        title: toasterData.title,
        description: toasterData.description,
        variant: toasterData.destructive ? 'destructive' : 'default',
      });
    }
  }, [toasterData, toast]);

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
        <Toaster />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  const message = getErrorMessage(error);

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="text-black font-body flex w-screen h-screen justify-center items-center">
        <div className="w-[75vw]">
          <h1 className="text-3xl font-heading mb-4">Oh no!</h1>
          <p>Er is iets fout gegaan helaas...</p>

          <pre className="p-6 font-type bg-black text-white">
            <code>{message}</code>
          </pre>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export const handle = {
  i18n: 'common',
};
