import {
  type ArticlesWithCategoriesSummaryList,
  type getArticleById,
  type getLocalisedArticleBySlug,
  type SummarisedArticle,
} from '~/models/articles.server';
import { type Columns, type TableData } from '~/components/Table';
import { type SupportedLanguages } from '~/i18n';
import { type Category } from '~/models/categories.server';
import { type ArticleFormValues } from '~/types/Article';
import { type CategoryFormValues } from '~/types/Category';
import { type SummarisedTool, type ToolFormValues } from '~/types/Tool';
import {
  type getToolByID,
  type ToolWithCategories,
} from '~/models/tools.server';
import { type SerializeFrom } from '@remix-run/node';
import {
  type OrganisationFormValues,
  type OrganisationsWithUserCount,
} from '~/types/Organisations';
import {
  type ProjectFormValues,
  type ProjectsWithOrganisationAndUsers,
} from '~/types/Project';
import { type Item } from '~/components/ItemCard';

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
  articleFormValues: Omit<ArticleFormValues, 'image'>
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
    image: '',
  };

  const id = formData.get('id') as string | null;
  if (id) {
    articleFormValues.id = id;
  }

  if (formData.has('image') && formData.get('image') !== 'undefined') {
    articleFormValues.image = formData.get('image') as string;
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

export function convertPrismaArticleToLocalisedArticle(
  article: Awaited<ReturnType<typeof getLocalisedArticleBySlug>>,
  lang: SupportedLanguages
) {
  return {
    id: article.id,
    title: article.title[lang],
    slug: article.slug[lang],
    summary: article.summary[lang],
    content: article.content[lang],
    image: article.image,
    author: {
      id: article.author.id,
      firstName: article.author.firstName,
      lastName: article.author.lastName,
      avatarUrl: article.author.avatarUrl,
    },
    categories: article.categories.map((category) => ({
      id: category.id,
      name: category.name[lang],
      slug: category.slug[lang],
    })),
    published: article.published,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
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
  tool: Omit<ToolFormValues, 'filename' | 'image'>
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
    filename: '',
    image: '',
    categories: (formData.get('categories') as string)
      .split(',')
      .filter(Boolean),
  };

  const id = formData.get('id') as string | null;
  if (id) {
    toolFormValues.id = id;
  }

  if (formData.has('tool') && formData.get('tool') !== 'undefined') {
    toolFormValues.filename = formData.get('tool') as string;
  }

  if (formData.has('image') && formData.get('image') !== 'undefined') {
    toolFormValues.image = formData.get('image') as string;
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
    filename: tool.filename,
    image: tool.image,
    categories: tool.categories.map((category) => category.id),
  };
}

export function convertOrganisationListToTableData(
  organisations: SerializeFrom<OrganisationsWithUserCount>[]
): [Columns, TableData[]] {
  const columns: Columns = ['Naam', 'Beschrijving', 'Aantal gebruikers'];

  const data: TableData[] = organisations.map((organisation) => {
    return {
      id: organisation.id,
      data: new Map([
        ['Naam', organisation.name],
        ['Beschrijving', organisation.description],
        ['Aantal gebruikers', organisation._count.users.toString()],
      ]),
    };
  });

  return [columns, data];
}

export function convertOrganisationFormValuesToFormData(
  organisationFormValues: OrganisationFormValues
): FormData {
  const formData = new FormData();

  formData.append('name', organisationFormValues.name);
  formData.append('description', organisationFormValues.description);

  if (organisationFormValues.id) {
    formData.append('id', organisationFormValues.id);
  }

  return formData;
}

export function convertFormDataToOrganisationFormValues(
  formData: FormData
): OrganisationFormValues {
  const organisationFormValues: OrganisationFormValues = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
  };

  const id = formData.get('id') as string | null;
  if (id) {
    organisationFormValues.id = id;
  }

  return organisationFormValues;
}

export function convertProjectListToTableData(
  projects: SerializeFrom<ProjectsWithOrganisationAndUsers>[]
): [Columns, TableData[]] {
  const columns: Columns = [
    'Naam',
    'Beschrijving',
    'Organisatie',
    'Deelnemers',
  ];

  const data: TableData[] = projects.map((project) => {
    return {
      id: project.id,
      data: new Map([
        ['Naam', project.name],
        ['Beschrijving', project.description],
        ['Organisatie', project.organisation.name],
        [
          'Deelnemers',
          project.users
            .map((user) => `${user.firstName} ${user.lastName}`)
            .join(', '),
        ],
      ]),
    };
  });

  return [columns, data];
}

export function convertProjectFormValuesToFormData(
  projectFormValues: ProjectFormValues
): FormData {
  const formData = new FormData();

  formData.append('name', projectFormValues.name);
  formData.append('description', projectFormValues.description);
  formData.append('organisationId', projectFormValues.organisationId);

  if (projectFormValues.id) {
    formData.append('id', projectFormValues.id);
  }

  return formData;
}

export function convertFormDataToProjectFormValues(
  formData: FormData
): ProjectFormValues {
  const projectFormValues: ProjectFormValues = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    organisationId: formData.get('organisationId') as string,
  };

  const id = formData.get('id') as string | null;
  if (id) {
    projectFormValues.id = id;
  }

  return projectFormValues;
}

export function convertArticleOrToolToItem(
  data: SummarisedArticle | SummarisedTool,
  type: 'article' | 'tool'
): Item {
  const item: Item = {
    type,
    id: data.id,
    title: { en: '', nl: '' }, // We initialize these to empty strings to satisfy the type checker
    summary: data.summary,
    slug: data.slug,
    image: data.image,
    categories: data.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })),
    updatedAt: data.updatedAt.toISOString(),
  };

  if ('author' in data) {
    item.author = {
      id: data.author.id,
      firstName: data.author.firstName,
      lastName: data.author.lastName,
    };
  }

  if ('title' in data) {
    item.title = data.title;
  } else {
    item.title = data.name;
  }

  return item;
}
