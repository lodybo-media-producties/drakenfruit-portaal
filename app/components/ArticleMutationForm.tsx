import { useTranslation } from 'react-i18next';
import { Form, useFetcher } from '@remix-run/react';
import slugify from '@sindresorhus/slugify';
import { type SerializedArticle as Article } from '~/models/articles.server';
import { type ArticleValidationErrors } from '~/types/Article';
import TextInput from '~/components/TextInput';
import Editor from '~/components/Editor';
import Label from '~/components/Label';
import TextAreaInput from '~/components/TextAreaInput';
import AuthorSelector, { type Author } from '~/components/AuthorSelector';
import CategoryInput, {
  type CategorySelection,
} from '~/components/CategoryInput';
import ImageInput from '~/components/ImageInput';
import Button from '~/components/Button';
import AnchorLink from '~/components/AnchorLink';
import Icon from '~/components/Icon';
import { useState } from 'react';
import SlugInput from '~/components/SlugInput';
import { type SupportedLanguages } from '~/i18n';
import Toggle, { type ToggleOption } from '~/components/Toggle';
import { convertArticleFormValuesToFormData } from '~/utils/content';

export type ArticleFormValues = Omit<
  Article,
  'id' | 'published' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
  categories: string[];
};

type Props = {
  mode: 'create' | 'update';
  initialValues?: ArticleFormValues;
  errors?: ArticleValidationErrors;
  authors: Author[];
  categories: CategorySelection[];
  backLink: string;
  backLinkLabel: string;
};

export default function ArticleMutationForm({
  mode,
  authors,
  categories,
  initialValues,
  backLink,
  backLinkLabel,
}: Props) {
  const { t } = useTranslation('components');
  const [lang, setLang] = useState<SupportedLanguages>('nl');
  const [slug, setSlug] = useState<string>(initialValues?.slug[lang] ?? '');
  const fetcher = useFetcher();
  const [enTitle, setEnTitle] = useState(initialValues?.title.en ?? '');
  const [nlTitle, setNlTitle] = useState(initialValues?.title.nl ?? '');
  const [enSlug, setEnSlug] = useState(initialValues?.slug.en ?? '');
  const [nlSlug, setNlSlug] = useState(initialValues?.slug.nl ?? '');
  const [enSummary, setEnSummary] = useState(initialValues?.summary.en ?? '');
  const [nlSummary, setNlSummary] = useState(initialValues?.summary.nl ?? '');
  const [enContent, setEnContent] = useState(initialValues?.content.en ?? '');
  const [nlContent, setNlContent] = useState(initialValues?.content.nl ?? '');
  const [selectedAuthorID, setSelectedAuthorID] = useState(
    initialValues?.authorId ?? ''
  );
  const [image, setImage] = useState(initialValues?.image ?? '');
  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState(
    initialValues?.categories ?? []
  );

  const getTitle = () => {
    if (lang === 'en') {
      return enTitle;
    } else {
      return nlTitle;
    }
  };
  const handleTitleChange = (title: string) => {
    if (lang === 'en') {
      setEnTitle(title);
    } else {
      setNlTitle(title);
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

  const getContent = () => {
    if (lang === 'en') {
      return enContent;
    } else {
      return nlContent;
    }
  };
  const handleContentChange = (content: string) => {
    if (lang === 'en') {
      setEnContent(content);
    } else {
      setNlContent(content);
    }
  };

  const handleAuthorChange = (authorID: string) => {
    setSelectedAuthorID(authorID);
  };

  const handleImageChange = (image: string) => {
    setImage(image);
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategoryIDs(categories);
  };

  const slugifyTitle = (title: string) => {
    if (!slug) {
      setSlug(slugify(title));
    }
  };

  const languageOptions: ToggleOption[] = [
    {
      label: 'Nederlands',
      value: 'nl',
    },
    {
      label: 'English',
      value: 'en',
    },
  ];

  const handleLangSelect = (value: string) => {
    setLang(value as SupportedLanguages);
  };

  const generateFormDataFromArticleValues = (): FormData => {
    const data: ArticleFormValues = {
      id: initialValues?.id ?? '',
      authorId: selectedAuthorID,
      title: {
        en: enTitle,
        nl: nlTitle,
      },
      slug: {
        en: enSlug,
        nl: nlSlug,
      },
      summary: {
        en: enSummary,
        nl: nlSummary,
      },
      content: {
        en: enContent,
        nl: nlContent,
      },
      image,
      categories: selectedCategoryIDs,
    };

    return convertArticleFormValuesToFormData(data);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = generateFormDataFromArticleValues();

    fetcher.submit(data, {
      action: '/api/articles',
      method: mode === 'create' ? 'POST' : 'PUT',
    });
  };

  return (
    <Form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      <Toggle options={languageOptions} onSelect={handleLangSelect} />

      <input type="hidden" name="articleID" defaultValue={initialValues?.id} />

      <TextInput
        className="w-3/4"
        name="title"
        label={t('ArticleMutationForm.Title Label')}
        value={getTitle()}
        onChange={(e) => handleTitleChange(e.target.value)}
        onBlur={(e) => slugifyTitle(e.target.value)}
      />

      <SlugInput
        className="w-3/4"
        name="slug"
        label={t('ArticleMutationForm.Slug Label')}
        value={getSlug()}
        onChange={(e) => handleSlugChange(e.target.value)}
      />

      <ImageInput
        name="image"
        label={t('ArticleMutationForm.Image Label')}
        value={image}
        onChange={handleImageChange}
      />

      <TextAreaInput
        className="w-3/4"
        label={t('ArticleMutationForm.Summary Label')}
        name="summary"
        value={getSummary()}
        onChange={(e) => handleSummaryChange(e.target.value)}
      />

      <Label label={t('ArticleMutationForm.Author Label')}>
        <AuthorSelector
          authors={authors}
          initialSelectedAuthorID={selectedAuthorID}
          onSelect={handleAuthorChange}
        />
      </Label>

      <Label label={t('ArticleMutationForm.Content Label')}>
        <Editor
          id="content"
          name="content"
          value={getContent()}
          onChange={handleContentChange}
        />
      </Label>

      <Label label={t('ArticleMutationForm.Category Label')}>
        <CategoryInput
          categories={categories}
          initialCategories={selectedCategoryIDs}
          onSelect={handleCategoriesChange}
        />
      </Label>

      <div className="flex flex-row justify-between items-center">
        <AnchorLink to={backLink}>
          <Icon className="mr-1" name="arrow-left" /> {backLinkLabel}
        </AnchorLink>

        <div className="flex flex-row gap-2">
          {mode === 'create' ? (
            <>
              <Button type="submit">
                {t('ArticleMutationForm.Save Button Label')}
              </Button>
              <Button primary type="submit">
                {t('ArticleMutationForm.Publish Button Label')}
              </Button>
            </>
          ) : (
            <Button primary type="submit">
              {t('ArticleMutationForm.Edit Button Label')}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}
