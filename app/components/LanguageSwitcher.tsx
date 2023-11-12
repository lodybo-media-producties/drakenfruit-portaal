import { useTranslation } from 'react-i18next';
import { NL, US } from 'country-flag-icons/react/3x2';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (i18n.language === 'nl') {
    return (
      <button onClick={() => changeLanguage('en')}>
        <US title="English" className="w-6 h-4" />
      </button>
    );
  }

  return (
    <button onClick={() => changeLanguage('nl')}>
      <NL title="Nederlands" className="w-6 h-4" />
    </button>
  );
}
