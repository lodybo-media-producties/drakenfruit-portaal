import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const ns = ['common', 'components'];
const supportedLngs = ['en', 'nl'];

const bundles = {};

const fetchBundle = async (language, namespace) => {
  const url = `/locales/${language}/${namespace}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    const data = await response.json();
    return { [namespace]: data };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return { [namespace]: {} };
  }
};

const fetchBundles = async () => {
  await Promise.all(
    supportedLngs.map(async (language) => {
      const languageBundles = await Promise.all(
        ns.map(async (namespace) => {
          return fetchBundle(language, namespace);
        })
      );
      bundles[language] = Object.assign({}, ...languageBundles);
    })
  );
};

await fetchBundles();

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    //debug: true,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    supportedLngs,
    resources: bundles,
  });

export default i18n;
