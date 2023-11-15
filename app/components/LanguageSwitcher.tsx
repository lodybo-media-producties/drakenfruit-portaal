import { useTranslation } from 'react-i18next';
import { NL, US } from 'country-flag-icons/react/3x2';

type Props = {
  mode?: 'small' | 'large';
};

export default function LanguageSwitcher({ mode }: Props) {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (i18n.language === 'nl') {
    return (
      <button
        className="flex flex-row gap-2 items-center"
        onClick={() => changeLanguage('en')}
      >
        <US title="English" className="w-6 h-4" />
        {mode === 'large' ? <span>English</span> : null}
      </button>
    );
  }

  return (
    <button
      className="flex flex-row gap-2 items-center"
      onClick={() => changeLanguage('nl')}
    >
      <NL title="Nederlands" className="w-6 h-4" />
      {mode === 'large' ? <span>Nederlands</span> : null}
    </button>
  );
}
