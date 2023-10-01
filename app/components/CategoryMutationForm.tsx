import {
  type CategoryFormValues,
  type CategoryValidationErrors,
} from '~/types/Category';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { type APIResponse } from '~/types/Responses';
import { type CategoryErrors } from '~/types/Validations';
import { useEffect, useState } from 'react';
import { type SupportedLanguages } from '~/i18n';
import { convertCategoryFormValuesToFormData } from '~/utils/content';
import Toggle, { type ToggleOption } from '~/components/Toggle';
import Message from '~/components/Message';
import TextInput from '~/components/TextInput';
import slugify from '@sindresorhus/slugify';
import SlugInput from '~/components/SlugInput';
import TextAreaInput from '~/components/TextAreaInput';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';
import Button from '~/components/Button';

type Props = {
  mode: 'create' | 'update';
  initialValues?: CategoryFormValues;
  errors?: CategoryValidationErrors;
  backLink: string;
  backLinkLabel: string;
};

export default function CategoryMutationForm({
  mode,
  initialValues,
  errors,
  backLink,
  backLinkLabel,
}: Props) {
  const { t } = useTranslation('components');
  const fetcher = useFetcher<APIResponse | CategoryErrors>();

  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<CategoryErrors>();
  const [lang, setLang] = useState<SupportedLanguages>('nl');

  const [enName, setEnName] = useState(initialValues?.name.en ?? '');
  const [nlName, setNlName] = useState(initialValues?.name.nl ?? '');
  const [enSlug, setEnSlug] = useState(initialValues?.slug.en ?? '');
  const [nlSlug, setNlSlug] = useState(initialValues?.slug.nl ?? '');
  const [enDescription, setEnDescription] = useState(
    initialValues?.description.en ?? ''
  );
  const [nlDescription, setNlDescription] = useState(
    initialValues?.description.nl ?? ''
  );

  useEffect(() => {
    if (fetcher.data) {
      if ('ok' in fetcher.data) {
        const data = fetcher.data as APIResponse;

        if (!data.ok) {
          setError(data.message);
        }
      } else {
        const data = fetcher.data as CategoryErrors;
        setFormErrors(data);
      }
    }
  }, [fetcher.data]);

  const handleLangSelect = (value: string) => {
    setLang(value as SupportedLanguages);
  };

  const getLocalisedError = (key: string) => {
    if (formErrors && lang === 'en') {
      return formErrors[key as keyof CategoryErrors]?.en;
    } else if (formErrors && lang === 'nl') {
      return formErrors[key as keyof CategoryErrors]?.nl;
    } else {
      return '';
    }
  };

  const getName = () => {
    if (lang === 'en') {
      return enName;
    } else {
      return nlName;
    }
  };
  const handleNameChange = (name: string) => {
    if (lang === 'en') {
      setEnName(name);
    } else {
      setNlName(name);
    }
  };

  const getSlug = () => {
    if (lang === 'en') {
      return enSlug;
    } else {
      return nlSlug;
    }
  };
  const handleSlugChange = (slug: string) => {
    if (lang === 'en') {
      setEnSlug(slug);
    } else {
      setNlSlug(slug);
    }
  };

  const getDescription = () => {
    if (lang === 'en') {
      return enDescription;
    } else {
      return nlDescription;
    }
  };
  const handleDescriptionChange = (summary: string) => {
    if (lang === 'en') {
      setEnDescription(summary);
    } else {
      setNlDescription(summary);
    }
  };

  const generateFormDataFromCategoryValues = (): FormData => {
    const data: CategoryFormValues = {
      id: initialValues?.id,
      name: {
        en: enName,
        nl: nlName,
      },
      slug: {
        en: enSlug,
        nl: nlSlug,
      },
      description: {
        en: enDescription,
        nl: nlDescription,
      },
    };

    return convertCategoryFormValuesToFormData(data);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = generateFormDataFromCategoryValues();
    data.append(
      'mode',
      ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement)?.value
    );

    fetcher.submit(data, {
      action: '/api/categories',
      method: mode === 'create' ? 'POST' : 'PUT',
    });
  };

  const getLanguageOptions = (): ToggleOption[] => {
    const languageOptions: ToggleOption[] = [
      {
        label: t('CategoryMutationForm.LanguageToggleLabels.Dutch'),
        value: 'nl',
      },
      {
        label: t('CategoryMutationForm.LanguageToggleLabels.English'),
        value: 'en',
      },
    ];

    if (formErrors) {
      const dutchErrorCount = Object.keys(formErrors).filter((key) => {
        return formErrors[key as keyof CategoryErrors]?.nl;
      }).length;

      const englishErrorCount = Object.keys(formErrors).filter((key) => {
        return formErrors[key as keyof CategoryErrors]?.en;
      }).length;

      if (dutchErrorCount > 0) {
        languageOptions.filter(
          (option) => option.value === 'nl'
        )[0].notificationCount = dutchErrorCount;
      }

      if (englishErrorCount > 0) {
        languageOptions.filter(
          (option) => option.value === 'en'
        )[0].notificationCount = englishErrorCount;
      }
    }

    return languageOptions;
  };

  const isSubmitting = fetcher.state !== 'idle';

  return (
    <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      <Message variant="error" message={error} />

      <Toggle options={getLanguageOptions()} onSelect={handleLangSelect} />

      <input type="hidden" name="categoryID" defaultValue={initialValues?.id} />

      <TextInput
        className="w-3/4"
        name="name"
        label={t('CategoryMutationForm.Name Label')}
        value={getName()}
        onChange={(e) => handleNameChange(e.target.value)}
        onBlur={(e) => handleSlugChange(slugify(e.target.value))}
        error={getLocalisedError('name')}
      />

      <SlugInput
        className="w-3/4"
        name="slug"
        label={t('CategoryMutationForm.Slug Label')}
        value={getSlug()}
        onChange={(e) => handleSlugChange(e.target.value)}
        error={getLocalisedError('slug')}
      />

      <TextAreaInput
        className="w-3/4"
        label={t('CategoryMutationForm.Description Label')}
        name="description"
        value={getDescription()}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        error={getLocalisedError('description')}
      />

      <div className="flex flex-row justify-between items-center">
        <AnchorLink to={backLink}>
          <Icon className="mr-1" name="arrow-left" /> {backLinkLabel}
        </AnchorLink>

        <div className="flex flex-row gap-2">
          <Button disabled={isSubmitting} primary type="submit">
            {mode === 'create'
              ? t('CategoryMutationForm.Save Button Label')
              : t('CategoryMutationForm.Edit Button Label')}
          </Button>
        </div>
      </div>
    </form>
  );
}
