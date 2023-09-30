import { type ArticlesWithCategoriesSummaryList } from '~/models/articles.server';
import { type Columns, type TableData } from '~/components/Table';
import { type ArticleFormValues } from '~/components/ArticleMutationForm';
import { SupportedLanguages } from '~/i18n';

export function convertArticleListToTableData(
  articles: ArticlesWithCategoriesSummaryList[],
  lang: SupportedLanguages
): [Columns, TableData[]] {
  const columns: Columns = ['Titel', 'Samenvatting', 'Auteur', 'Categorieën'];

  const data: TableData[] = articles.map((article) => {
    return {
      id: article.id,
      data: new Map([
        ['Titel', article.title[lang]],
        ['Samenvatting', article.summary[lang]],
        ['Auteur', `${article.author.firstName} ${article.author.lastName}`],
        [
          'Categorieën',
          article.categories.map((category) => category.name[lang]).join(', '),
        ],
      ]),
    };
  });

  return [columns, data];
}

export function convertArticleFormValuesToFormData(
  articleFormValues: ArticleFormValues
): FormData {
  const formData = new FormData();

  formData.append('title.en', articleFormValues.title.en);
  formData.append('title.nl', articleFormValues.title.nl);
  formData.append('slug.en', articleFormValues.slug.en);
  formData.append('slug.nl', articleFormValues.slug.nl);
  formData.append('summary.en', articleFormValues.summary.en);
  formData.append('summary.nl', articleFormValues.summary.nl);
  formData.append('content.en', articleFormValues.content.en);
  formData.append('content.nl', articleFormValues.content.nl);
  formData.append('categories', articleFormValues.categories.join(','));
  formData.append('authorId', articleFormValues.authorId);

  if (articleFormValues.id) {
    formData.append('id', articleFormValues.id);
  }

  if (articleFormValues.image) {
    formData.append('image', articleFormValues.image);
  }

  return formData;
}

export function convertFormDataToArticleFormValues(
  formData: FormData
): ArticleFormValues {
  const articleFormValues: ArticleFormValues = {
    title: {
      en: formData.get('title.en') as string,
      nl: formData.get('title.nl') as string,
    },
    slug: {
      en: formData.get('slug.en') as string,
      nl: formData.get('slug.nl') as string,
    },
    summary: {
      en: formData.get('summary.en') as string,
      nl: formData.get('summary.nl') as string,
    },
    content: {
      en: formData.get('content.en') as string,
      nl: formData.get('content.nl') as string,
    },
    categories: (formData.get('categories') as string).split(','),
    authorId: formData.get('authorId') as string,
    image: formData.get('image') as string | null,
  };

  const id = formData.get('id') as string | null;
  if (id) {
    articleFormValues.id = id;
  }

  return articleFormValues;
}
