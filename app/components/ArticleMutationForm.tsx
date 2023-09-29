import { useTranslation } from 'react-i18next';
import { Form } from '@remix-run/react';
import { type SerializedArticle as Article } from '~/models/articles.server';
import { type ArticleValidationErrors } from '~/types/Article';
import TextInput from '~/components/TextInput';
import Editor from '~/components/Editor';
import Label from '~/components/Label';
import TextAreaInput from '~/components/TextAreaInput';
import AuthorSelector, { type Author } from '~/components/AuthorSelector';

type Props = {
  mode: 'create' | 'update';
  initialValues?: Article;
  errors?: ArticleValidationErrors;
  authors: Author[];
};

export default function ArticleMutationForm({
  mode,
  authors,
  initialValues,
}: Props) {
  const { t, i18n } = useTranslation('components');
  const i = i18n.language === 'nl' ? 'nl' : 'en';

  return (
    <Form className="w-full flex flex-col space-y-4">
      <TextInput
        className="w-3/4"
        name="title"
        label={t('ArticleMutationForm.Title Label')}
        defaultValue={initialValues?.title[i]}
      />

      <TextAreaInput
        className="w-3/4"
        label={t('ArticleMutationForm.Summary Label')}
        name="summary"
      />

      <Label label={t('ArticleMutationForm.Author Label')}>
        <AuthorSelector authors={authors} />
      </Label>

      <Label label={t('ArticleMutationForm.Content Label')}>
        <Editor name="content" initialValue={initialValues?.content[i]} />
      </Label>
    </Form>
  );
}
