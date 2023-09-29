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

type ArticleFormValues = Omit<Article, 'createdAt' | 'updatedAt'> & {
  categories: string[];
};

type ArticleStringValues = Pick<
  Record<keyof ArticleFormValues, string>,
  'title' | 'slug' | 'summary' | 'content'
>;

type LocalisedArticleValues = {
  [key in SupportedLanguages]: ArticleStringValues;
};

type Props = {
  mode: 'create' | 'update';
  initialValues?: ArticleFormValues;
  errors?: ArticleValidationErrors;
  authors: Author[];
  categories: CategorySelection[];
  backLink: string;
  backLinkLabel: string;
  onSubmit: (values: ArticleFormValues) => void;
};

export default function ArticleMutationForm({
  mode,
  authors,
  categories,
  initialValues,
  backLink,
  backLinkLabel,
  onSubmit,
}: Props) {
  const { t } = useTranslation('components');
  const [lang, setLang] = useState<SupportedLanguages>('nl');
  const [slug, setSlug] = useState<string>(initialValues?.slug[lang] ?? '');
  const [values, setValues] = useState<LocalisedArticleValues>({
    nl: {
      title: initialValues?.title.nl ?? '',
      slug: initialValues?.slug.nl ?? '',
      summary: initialValues?.summary.nl ?? '',
      content: initialValues?.content.nl ?? '',
    },
    en: {
      title: initialValues?.title.en ?? '',
      slug: initialValues?.slug.en ?? '',
      summary: initialValues?.summary.en ?? '',
      content: initialValues?.content.en ?? '',
    },
  });
  const fetcher = useFetcher();

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

  const updateValues = (name: string, value: string) => {
    setValues({
      ...values,
      [lang]: {
        [name]: value,
      },
    });
  };

  const handleLangSelect = (value: string) => {
    setLang(value as SupportedLanguages);
  };

  const generateArticle = (): ArticleFormValues => {
    return {
      id: initialValues?.id ?? '',
      authorId: initialValues?.authorId ?? '',
      published: initialValues?.published ?? false, // TODO: handle this
      title: {
        nl: values.nl.title,
        en: values.en.title,
      },
      slug: {
        nl: values.nl.slug,
        en: values.en.slug,
      },
      summary: {
        nl: values.nl.summary,
        en: values.en.summary,
      },
      content: {
        nl: values.nl.content,
        en: values.en.content,
      },
      categories: initialValues?.categories ?? [],
      image: initialValues?.image ?? '',
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetcher.submit(generateArticle(), {
      action: '/api/articles',
      method: mode === 'create' ? 'POST' : 'PUT',
    });
  };

  return (
    <Form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      <Toggle options={languageOptions} onSelect={handleLangSelect} />

      <input type="hidden" name="articleID" defaultValue={initialValues?.id} />

      <p>{initialValues?.title[lang]}</p>
      <TextInput
        className="w-3/4"
        name="title"
        label={t('ArticleMutationForm.Title Label')}
        value={values[lang].title}
        onChange={(e) => updateValues(e.target.name, e.target.value)}
        onBlur={(e) => slugifyTitle(e.target.value)}
      />

      <SlugInput
        className="w-3/4"
        name="slug"
        label={t('ArticleMutationForm.Slug Label')}
        defaultValue={slug}
      />

      <ImageInput
        name="image"
        label={t('ArticleMutationForm.Image Label')}
        initialValue={initialValues?.image}
      />

      <TextAreaInput
        className="w-3/4"
        label={t('ArticleMutationForm.Summary Label')}
        name="summary"
        value={values[lang].summary}
        onChange={(e) => updateValues(e.target.name, e.target.value)}
      />

      <Label label={t('ArticleMutationForm.Author Label')}>
        <AuthorSelector
          authors={authors}
          initialSelectedAuthorID={initialValues?.authorId}
        />
      </Label>

      <Label label={t('ArticleMutationForm.Content Label')}>
        <Editor name="content" initialValue={values[lang].content} />
      </Label>

      <Label label={t('ArticleMutationForm.Category Label')}>
        <CategoryInput
          categories={categories}
          initialCategories={initialValues?.categories}
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
