import {
  type ArticlesWithCategoriesSummaryList,
  type getArticleById,
} from '~/models/articles.server';
import { type Columns, type TableData } from '~/components/Table';
import { type SupportedLanguages } from '~/i18n';
import { type Category } from '~/models/categories.server';
import { type ArticleFormValues } from '~/types/Article';
import { type CategoryFormValues } from '~/types/Category';
import { type ToolFormValues } from '~/types/Tool';
import {
  type getToolByID,
  type ToolWithCategories,
} from '~/models/tools.server';

export function convertArticleListToTableData(
  articles: ArticlesWithCategoriesSummaryList[],
  lang: SupportedLanguages
): [Columns, TableData[]] {
  const columns: Columns = [
    'Titel',
    'Samenvatting',
    'Auteur',
    'Categorieën',
    'Gepubliceerd',
  ];

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
        ['Gepubliceerd', article.published ? 'true' : 'false'],
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
    categories: (formData.get('categories') as string)
      .split(',')
      .filter(Boolean),
    authorId: formData.get('authorId') as string,
    image: formData.get('image') as string | null,
  };

  const id = formData.get('id') as string | null;
  if (id) {
    articleFormValues.id = id;
  }

  return articleFormValues;
}

export function convertPrismaArticleToArticleFormValues(
  article: Awaited<ReturnType<typeof getArticleById>>
): ArticleFormValues {
  return {
    id: article.id,
    title: {
      en: article.title.en,
      nl: article.title.nl,
    },
    slug: {
      en: article.slug.en,
      nl: article.slug.nl,
    },
    summary: {
      en: article.summary.en,
      nl: article.summary.nl,
    },
    content: {
      en: article.content.en,
      nl: article.content.nl,
    },
    categories: article.categories.map((category) => category.id),
    authorId: article.author.id,
    image: article.image,
    published: article.published,
  };
}

export function convertCategoryListToTableData(
  categories: Category[],
  lang: SupportedLanguages
): [Columns, TableData[]] {
  const columns: Columns = ['Naam', 'Slug', 'Beschrijving'];

  const data: TableData[] = categories.map((category) => {
    return {
      id: category.id,
      data: new Map([
        ['Naam', category.name[lang]],
        ['Slug', category.slug[lang]],
        ['Beschrijving', category.description[lang]],
      ]),
    };
  });

  return [columns, data];
}

export function convertCategoryFormValuesToFormData(
  categoryFormValues: CategoryFormValues
): FormData {
  const formData = new FormData();

  formData.append('name.en', categoryFormValues.name.en);
  formData.append('name.nl', categoryFormValues.name.nl);
  formData.append('slug.en', categoryFormValues.slug.en);
  formData.append('slug.nl', categoryFormValues.slug.nl);
  formData.append('description.en', categoryFormValues.description.en);
  formData.append('description.nl', categoryFormValues.description.nl);

  if (categoryFormValues.id) {
    formData.append('id', categoryFormValues.id);
  }

  return formData;
}

export function convertFormDataToCategoryFormValues(
  formData: FormData
): CategoryFormValues {
  const categoryFormValues: CategoryFormValues = {
    name: {
      en: formData.get('name.en') as string,
      nl: formData.get('name.nl') as string,
    },
    slug: {
      en: formData.get('slug.en') as string,
      nl: formData.get('slug.nl') as string,
    },
    description: {
      en: formData.get('description.en') as string,
      nl: formData.get('description.nl') as string,
    },
  };

  const id = formData.get('id') as string | null;
  if (id) {
    categoryFormValues.id = id;
  }

  return categoryFormValues;
}

export function convertToolListToTableData(
  tools: ToolWithCategories[],
  lang: SupportedLanguages
): [Columns, TableData[]] {
  const columns: Columns = ['Naam', 'Slug', 'Samenvatting', 'Categorieën'];

  const data: TableData[] = tools.map((tool) => {
    return {
      id: tool.id,
      data: new Map([
        ['Naam', tool.name[lang]],
        ['Slug', tool.slug[lang]],
        ['Samenvatting', tool.summary[lang]],
        [
          'Categorieën',
          tool.categories.map((category) => category.name[lang]).join(', '),
        ],
      ]),
    };
  });

  return [columns, data];
}

export function convertToolFormValuesToFormData(
  tool: Omit<ToolFormValues, 'downloadUrl'>
): FormData {
  const formData = new FormData();

  formData.append('name.en', tool.name.en);
  formData.append('name.nl', tool.name.nl);
  formData.append('slug.en', tool.slug.en);
  formData.append('slug.nl', tool.slug.nl);
  formData.append('summary.en', tool.summary.en);
  formData.append('summary.nl', tool.summary.nl);
  formData.append('description.en', tool.description.en);
  formData.append('description.nl', tool.description.nl);
  formData.append('categories', tool.categories.join(','));

  if (tool.id) {
    formData.append('id', tool.id);
  }

  return formData;
}

export function convertFormDataIntoToolFormValues(
  formData: FormData
): ToolFormValues {
  const toolFormValues: ToolFormValues = {
    name: {
      en: formData.get('name.en') as string,
      nl: formData.get('name.nl') as string,
    },
    slug: {
      en: formData.get('slug.en') as string,
      nl: formData.get('slug.nl') as string,
    },
    summary: {
      en: formData.get('summary.en') as string,
      nl: formData.get('summary.nl') as string,
    },
    description: {
      en: formData.get('description.en') as string,
      nl: formData.get('description.nl') as string,
    },
    downloadUrl: formData.get('tool') as string,
    categories: (formData.get('categories') as string)
      .split(',')
      .filter(Boolean),
  };

  const id = formData.get('id') as string | null;
  if (id) {
    toolFormValues.id = id;
  }

  return toolFormValues;
}

export function convertPrismaToolDataToToolFormValues(
  tool: Awaited<ReturnType<typeof getToolByID>>
): ToolFormValues {
  return {
    id: tool.id,
    name: {
      en: tool.name.en,
      nl: tool.name.nl,
    },
    slug: {
      en: tool.slug.en,
      nl: tool.slug.nl,
    },
    summary: {
      en: tool.summary.en,
      nl: tool.summary.nl,
    },
    description: {
      en: tool.description.en,
      nl: tool.description.nl,
    },
    downloadUrl: tool.downloadUrl,
    categories: tool.categories.map((category) => category.id),
  };
}
