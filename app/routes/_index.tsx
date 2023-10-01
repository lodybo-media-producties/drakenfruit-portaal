import type { MetaFunction } from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import type { Filter } from '~/components/SearchFilters';
import SearchFilters from '~/components/SearchFilters';
import Button from '~/components/Button';

export const meta: MetaFunction = () => [{ title: 'Drakenfruit' }];

export default function Index() {
  const { t, i18n } = useTranslation();

  const filters: Filter[] = [
    {
      slug: 'accessibility',
      label: t('SearchFilters.Accessibility'),
      defaultChecked: true,
    },
    { slug: 'measurements', label: t('SearchFilters.Measurements') },
    {
      slug: 'project-management',
      label: t('SearchFilters.Project Management'),
    },
    { slug: 'tools', label: t('SearchFilters.Tools') },
    { slug: 'webinars', label: t('SearchFilters.Webinars') },
  ];

  const handleChangeLanguage = () => {
    const locale = i18n.language === 'nl' ? 'en' : 'nl';
    i18n.changeLanguage(locale);
  };

  return (
    <div className="px-8 pt-12">
      <SearchFilters filters={filters} onSelectedFiltersChange={() => {}} />

      <Button onClick={handleChangeLanguage}>{t('change language')}</Button>
      <h1 className="mt-5 text-4xl font-bold">{t('greeting')}</h1>
    </div>
  );
}
