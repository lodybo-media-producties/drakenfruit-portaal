import { type ToolErrors } from '~/types/Validations';
import { type ToolFormValues } from '~/types/Tool';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { type APIResponse } from '~/types/Responses';
import { useEffect, useState } from 'react';
import { type SupportedLanguages } from '~/i18n';
import { convertToolFormValuesToFormData } from '~/utils/content';
import Toggle, { type ToggleOption } from '~/components/Toggle';
import { type Tool } from '~/models/tools.server';
import Message from '~/components/Message';
import TextInput from '~/components/TextInput';
import slugify from '@sindresorhus/slugify';
import SlugInput from '~/components/SlugInput';
import TextAreaInput from '~/components/TextAreaInput';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';
import Loader from '~/components/Loader';
import Button from '~/components/Button';
import Editor from '~/components/Editor';
import CategoryInput, {
  type CategorySelection,
} from '~/components/CategoryInput';
import FileInput from '~/components/FileInput';

type Props = {
  mode: 'create' | 'update';
  initialValues?: ToolFormValues;
  errors?: ToolErrors;
  backLink?: string;
  backLinkLabel?: string;
  categories: CategorySelection[];
};

export default function ToolMutationForm({
  mode,
  initialValues,
  errors,
  backLink,
  backLinkLabel,
  categories,
}: Props) {
  const { t } = useTranslation('components');
  const fetcher = useFetcher<APIResponse | ToolErrors>();

  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<ToolErrors | undefined>(errors);
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
  const [enSummary, setEnSummary] = useState(initialValues?.summary.en ?? '');
  const [nlSummary, setNlSummary] = useState(initialValues?.summary.nl ?? '');
  const [downloadUrl, setDownloadUrl] = useState(
    initialValues?.downloadUrl ?? ''
  );
  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState(
    initialValues?.categories ?? []
  );

  const handleLangSelect = (value: string) => {
    setLang(value as SupportedLanguages);
  };

  const getLocalisedError = (key: string) => {
    if (formErrors && lang === 'en') {
      const error = formErrors[key as keyof ToolErrors];
      if (typeof error === 'string') {
        return error;
      }

      return error?.en;
    } else if (formErrors && lang === 'nl') {
      const error = formErrors[key as keyof ToolErrors];
      if (typeof error === 'string') {
        return error;
      }

      return error?.nl;
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

  const getSummary = () => {
    if (lang === 'en') {
      return enSummary;
    } else {
      return nlSummary;
    }
  };
  const handleSummaryChange = (summary: string) => {
    if (lang === 'en') {
      setEnSummary(summary);
    } else {
      setNlSummary(summary);
    }
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategoryIDs(categories);
  };

  const generateFormDataFromToolFormValues = () => {
    const data: ToolFormValues = {
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
      summary: {
        en: enDescription,
        nl: nlDescription,
      },
      downloadUrl,
      categories: selectedCategoryIDs,
    };

    return convertToolFormValuesToFormData(data);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const data = generateFormDataFromToolFormValues();
    console.log(data);

    fetcher.submit(data, {
      action: '/api/tools',
      method: mode === 'create' ? 'POST' : 'PUT',
    });
  };

  const getLanguageOptions = (): ToggleOption[] => {
    const languageOptions: ToggleOption[] = [
      {
        label: t('ToolMutationForm.LanguageToggleLabels.Dutch'),
        value: 'nl',
      },
      {
        label: t('ToolMutationForm.LanguageToggleLabels.English'),
        value: 'en',
      },
    ];

    if (formErrors) {
      const dutchErrorCount = Object.keys(formErrors).filter((key) => {
        const err = formErrors[key as keyof ToolErrors];
        if (typeof err === 'string') {
          return err;
        }
        return err?.nl;
      }).length;

      const englishErrorCount = Object.keys(formErrors).filter((key) => {
        const err = formErrors[key as keyof ToolErrors];
        if (typeof err === 'string') {
          return err;
        }
        return err?.en;
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

  useEffect(() => {
    if (fetcher.data) {
      if ('ok' in fetcher.data) {
        const data = fetcher.data as APIResponse<Tool>;

        if (!data.ok) {
          setError(data.message);
        }
      } else {
        const data = fetcher.data as ToolErrors;
        setFormErrors(data);
      }
    }
  }, [fetcher.data]);

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <Message variant="error" message={error} />

      <Toggle options={getLanguageOptions()} onSelect={handleLangSelect} />

      <input type="hidden" name="categoryID" defaultValue={initialValues?.id} />

      <TextInput
        className="w-3/4"
        name="name"
        label={t('ToolMutationForm.Name Label')}
        value={getName()}
        onChange={(e) => handleNameChange(e.target.value)}
        onBlur={(e) => handleSlugChange(slugify(e.target.value))}
        error={getLocalisedError('name')}
      />

      <SlugInput
        className="w-3/4"
        name="slug"
        label={t('ToolMutationForm.Slug Label')}
        value={getSlug()}
        onChange={(e) => handleSlugChange(e.target.value)}
        error={getLocalisedError('slug')}
      />

      <CategoryInput
        categories={categories}
        initialCategories={selectedCategoryIDs}
        onSelect={handleCategoriesChange}
      />

      <TextAreaInput
        className="w-3/4"
        label={t('ToolMutationForm.Summary Label')}
        name="summary"
        value={getSummary()}
        onChange={(e) => handleSummaryChange(e.target.value)}
        error={getLocalisedError('summary')}
      />

      <Editor
        name="description"
        value={getDescription()}
        onChange={(e) => handleDescriptionChange(e)}
      />

      <FileInput
        label={t('ToolMutationForm.File Label')}
        name="tool"
        value={downloadUrl}
        onChange={setDownloadUrl}
        error={getLocalisedError('downloadUrl')}
      />

      <div
        className={`flex flex-row items-center ${
          backLink && backLinkLabel ? 'justify-between' : 'justify-end'
        }`}
      >
        {backLink && backLinkLabel ? (
          <AnchorLink to={backLink}>
            <Icon className="mr-1" name="arrow-left" /> {backLinkLabel}
          </AnchorLink>
        ) : null}

        <div className="flex flex-row gap-2">
          {isSubmitting ? (
            <div className="self-center">
              <Loader />
            </div>
          ) : null}
          <Button disabled={isSubmitting} primary type="submit">
            {mode === 'create'
              ? t('ToolMutationForm.Save Button Label')
              : t('ToolMutationForm.Edit Button Label')}
          </Button>
        </div>
      </div>
    </form>
  );
}
