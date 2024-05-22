import { useTranslation } from 'react-i18next';

export default function WebinarsIndexRoute() {
  const { t } = useTranslation('routes');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-4xl">{t('Webinars.Index.Title')}</h1>
        <p>{t('Webinars.Index.No Webinars')}</p>
      </div>
    </div>
  );
}
