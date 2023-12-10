import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next';
import i18n, { type SupportedLanguages } from '~/i18n'; // your i18n configuration file
import { langSessionCookie } from '~/cookies.server';
import { getUser } from '~/session.server';
import { type User } from '~/models/user.server';

let i18next = new RemixI18Next({
  detection: {
    // order: ['cookie'],
    cookie: langSessionCookie,
    supportedLanguages: i18n.supportedLngs as unknown as string[],
    fallbackLanguage: i18n.fallbackLng,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    },
  },
  // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
  // E.g. The Backend plugin for loading translations from the file system
  // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
  plugins: [Backend],
});

export default i18next;

export async function detectLocale(
  request: Request,
  usr?: User | null
): Promise<SupportedLanguages> {
  let locale: string;

  const user = usr || (await getUser(request));

  if (user) {
    locale = user.locale;
  } else {
    const cookieLocale = await langSessionCookie.parse(
      request.headers.get('Cookie')
    );

    if (cookieLocale) {
      locale = cookieLocale;
    } else {
      const subdomain = request.headers.get('Host')?.split('.')[0];

      if (subdomain === 'my') {
        locale = 'en';
      } else {
        locale = 'nl';
      }
    }
  }

  return locale as SupportedLanguages;
}
