import { describe, test } from 'vitest';
import { type SerializeFrom } from '@remix-run/node';
import {
  type ArticlesWithCategoriesSummaryList,
  type getArticleById,
  type getLocalisedArticleBySlug,
  type SummarisedArticle,
} from '~/models/articles.server';
import {
  convertArticleListToTableData,
  convertArticleFormValuesToFormData,
  convertFormDataToArticleFormValues,
  convertPrismaArticleToArticleFormValues,
  convertCategoryListToTableData,
  convertCategoryFormValuesToFormData,
  convertFormDataToCategoryFormValues,
  convertToolFormValuesToFormData,
  convertFormDataIntoToolFormValues,
  convertToolListToTableData,
  convertPrismaToolDataToToolFormValues,
  convertPrismaArticleToLocalisedArticle,
  convertOrganisationListToTableData,
  convertOrganisationFormValuesToFormData,
  convertFormDataToOrganisationFormValues,
  convertProjectListToTableData,
  convertProjectFormValuesToFormData,
  convertArticleOrToolToItem,
  convertUserListToTableData,
  convertUserFormValuesToFormData,
} from '~/utils/content';
import { type Category } from '~/models/categories.server';
import { type ArticleFormValues } from '~/types/Article';
import { type CategoryFormValues } from '~/types/Category';
import {
  type getToolByID,
  type ToolWithCategories,
} from '~/models/tools.server';
import { type SummarisedTool, type ToolFormValues } from '~/types/Tool';
import { type OrganisationsWithUserCount } from '~/types/Organisations';
import { type ProjectsWithOrganisationAndUsers } from '~/types/Project';
import { type Item } from '~/components/ItemCard';
import { UserFormValues, UserWithProjectsAndOrgs } from '~/types/User';

describe('Content utilities', () => {
  describe('Articles', () => {
    test('Convert an array of articles to table data', () => {
      const articles: ArticlesWithCategoriesSummaryList[] = [
        {
          id: '1',
          title: { en: 'Title 1', nl: 'Titel 1' },
          slug: { en: 'title-1', nl: 'titel-1' },
          published: true,
          summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
          authorId: '1',
          author: {
            id: '1',
            firstName: 'Kaylee',
            lastName: 'Rosalina',
          },
          content: { en: 'Content 1', nl: 'Inhoud 1' },
          categories: [
            {
              id: '1',
              name: { en: 'Category 1', nl: 'Categorie 1' },
            },
          ],
          image: '/path/to/image',
        },
      ];

      const [columns, data] = convertArticleListToTableData(articles, 'en');

      expect(columns).toEqual([
        'Titel',
        'Samenvatting',
        'Auteur',
        'Categorieën',
        'Gepubliceerd',
      ]);

      expect(data).toEqual([
        {
          id: '1',
          data: new Map([
            ['Titel', 'Title 1'],
            ['Samenvatting', 'Summary 1'],
            ['Auteur', 'Kaylee Rosalina'],
            ['Categorieën', 'Category 1'],
            ['Gepubliceerd', 'true'],
          ]),
        },
      ]);
    });

    test('Convert an ArticleFormValue object into FormData', () => {
      const article: ArticleFormValues = {
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: ['1', '2'],
        authorId: '1',
        image: '/path/to/image.jpg',
      };

      const formData = convertArticleFormValuesToFormData(article);

      expect(formData.get('id')).toEqual('1');
      expect(formData.get('title.en')).toEqual('Title 1');
      expect(formData.get('title.nl')).toEqual('Titel 1');
      expect(formData.get('slug.en')).toEqual('title-1');
      expect(formData.get('slug.nl')).toEqual('titel-1');
      expect(formData.get('summary.en')).toEqual('Summary 1');
      expect(formData.get('summary.nl')).toEqual('Samenvatting 1');
      expect(formData.get('content.en')).toEqual('Content 1');
      expect(formData.get('content.nl')).toEqual('Inhoud 1');
      expect(formData.get('categories')).toEqual('1,2');
      expect(formData.get('authorId')).toEqual('1');
      expect(formData.get('image')).toBeNull();
    });

    test('Convert an ArticleFormValue object into FormData without an image', () => {
      const article: ArticleFormValues = {
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: ['1', '2'],
        authorId: '1',
        image: '/path/to/image',
      };

      const formData = convertArticleFormValuesToFormData(article);

      expect(formData.get('id')).toEqual('1');
      expect(formData.get('title.en')).toEqual('Title 1');
      expect(formData.get('title.nl')).toEqual('Titel 1');
      expect(formData.get('slug.en')).toEqual('title-1');
      expect(formData.get('slug.nl')).toEqual('titel-1');
      expect(formData.get('summary.en')).toEqual('Summary 1');
      expect(formData.get('summary.nl')).toEqual('Samenvatting 1');
      expect(formData.get('content.en')).toEqual('Content 1');
      expect(formData.get('content.nl')).toEqual('Inhoud 1');
      expect(formData.get('categories')).toEqual('1,2');
      expect(formData.get('authorId')).toEqual('1');
    });

    test('Convert FormData to ArticleFormValue', () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('title.en', 'Title 1');
      formData.append('title.nl', 'Titel 1');
      formData.append('slug.en', 'title-1');
      formData.append('slug.nl', 'titel-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('content.en', 'Content 1');
      formData.append('content.nl', 'Inhoud 1');
      formData.append('categories', '1,2');
      formData.append('authorId', '1');
      formData.append('image', '/path/to/image.jpg');

      const article = convertFormDataToArticleFormValues(formData);

      expect(article).toEqual({
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: ['1', '2'],
        authorId: '1',
        image: '/path/to/image.jpg',
      });
    });

    test('Convert FormData to ArticleFormValue without categories', () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('title.en', 'Title 1');
      formData.append('title.nl', 'Titel 1');
      formData.append('slug.en', 'title-1');
      formData.append('slug.nl', 'titel-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('content.en', 'Content 1');
      formData.append('content.nl', 'Inhoud 1');
      formData.append('categories', '');
      formData.append('authorId', '1');
      formData.append('image', '/path/to/image.jpg');

      const article = convertFormDataToArticleFormValues(formData);

      expect(article).toEqual({
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: [],
        authorId: '1',
        image: '/path/to/image.jpg',
      });
    });

    test('Convert FormData to ArticleFormValue without an image', () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('title.en', 'Title 1');
      formData.append('title.nl', 'Titel 1');
      formData.append('slug.en', 'title-1');
      formData.append('slug.nl', 'titel-1');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('content.en', 'Content 1');
      formData.append('content.nl', 'Inhoud 1');
      formData.append('categories', '');
      formData.append('authorId', '1');
      formData.append('image', 'undefined');

      const article = convertFormDataToArticleFormValues(formData);

      expect(article).toEqual({
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: [],
        authorId: '1',
        image: '',
      });
    });

    test('Converting the article data from Prisma to an ArticleFormValue', () => {
      const articleFromPrisma: Awaited<ReturnType<typeof getArticleById>> = {
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        published: true,
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        authorId: '1',
        author: {
          id: '1',
          firstName: 'Kaylee',
          lastName: 'Rosalina',
          role: 'ADMIN',
          locale: 'nl',
          email: 'kaylee@drakenfruit.com',
          organisationId: '1',
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: [
          {
            id: '1',
            name: { en: 'Category 1', nl: 'Categorie 1' },
            slug: { en: 'category-1', nl: 'categorie-1' },
            description: { en: 'Description 1', nl: 'Beschrijving 1' },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        image: '/path/to/image',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const article =
        convertPrismaArticleToArticleFormValues(articleFromPrisma);

      expect(article).toEqual<ArticleFormValues>({
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: ['1'],
        authorId: '1',
        image: '/path/to/image',
        published: true,
      });
    });

    test('Converting the article data of an unpublished article from Prisma to an ArticleFormValue', () => {
      const articleFromPrisma: Awaited<ReturnType<typeof getArticleById>> = {
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        published: false,
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        authorId: '1',
        author: {
          id: '1',
          firstName: 'Kaylee',
          lastName: 'Rosalina',
          role: 'ADMIN',
          locale: 'nl',
          email: 'kaylee@drakenfruit.com',
          organisationId: '1',
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: [
          {
            id: '1',
            name: { en: 'Category 1', nl: 'Categorie 1' },
            slug: { en: 'category-1', nl: 'categorie-1' },
            description: { en: 'Description 1', nl: 'Beschrijving 1' },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        image: '/path/to/image',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const article =
        convertPrismaArticleToArticleFormValues(articleFromPrisma);

      expect(article).toEqual<ArticleFormValues>({
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: ['1'],
        authorId: '1',
        image: '/path/to/image',
        published: false,
      });
    });

    test('Converting a full Prisma article dataset to a localised article', () => {
      const articleFromPrisma: Awaited<
        ReturnType<typeof getLocalisedArticleBySlug>
      > = {
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        published: true,
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        authorId: '1',
        author: {
          id: '1',
          firstName: 'Kaylee',
          lastName: 'Rosalina',
          avatarUrl: '/path/to/image',
        },
        content: { en: 'Content 1', nl: 'Inhoud 1' },
        categories: [
          {
            id: '1',
            name: { en: 'Category 1', nl: 'Categorie 1' },
            slug: { en: 'category-1', nl: 'categorie-1' },
          },
        ],
        image: '/path/to/image',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dutchArticle = convertPrismaArticleToLocalisedArticle(
        articleFromPrisma,
        'nl'
      );
      const englishArticle = convertPrismaArticleToLocalisedArticle(
        articleFromPrisma,
        'en'
      );

      expect(dutchArticle).toEqual({
        id: '1',
        title: 'Titel 1',
        slug: 'titel-1',
        published: true,
        image: '/path/to/image',
        summary: 'Samenvatting 1',
        author: {
          id: '1',
          firstName: 'Kaylee',
          lastName: 'Rosalina',
          avatarUrl: '/path/to/image',
        },
        content: 'Inhoud 1',
        categories: [
          {
            id: '1',
            name: 'Categorie 1',
            slug: 'categorie-1',
          },
        ],
        createdAt: articleFromPrisma.createdAt,
        updatedAt: articleFromPrisma.updatedAt,
      });

      expect(englishArticle).toEqual({
        id: '1',
        title: 'Title 1',
        slug: 'title-1',
        published: true,
        image: '/path/to/image',
        summary: 'Summary 1',
        author: {
          id: '1',
          firstName: 'Kaylee',
          lastName: 'Rosalina',
          avatarUrl: '/path/to/image',
        },
        content: 'Content 1',
        categories: [
          {
            id: '1',
            name: 'Category 1',
            slug: 'category-1',
          },
        ],
        createdAt: articleFromPrisma.createdAt,
        updatedAt: articleFromPrisma.updatedAt,
      });
    });
  });

  describe('Categories', () => {
    test('Converting a list of categories from the database into table data', () => {
      const categories: Category[] = [
        {
          id: '1',
          name: { en: 'Category 1', nl: 'Categorie 1' },
          slug: { en: 'category-1', nl: 'categorie-1' },
          description: { en: 'Description 1', nl: 'Beschrijving 1' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const [columns, data] = convertCategoryListToTableData(categories, 'en');

      expect(columns).toEqual(['Naam', 'Slug', 'Beschrijving']);

      expect(data).toEqual([
        {
          id: '1',
          data: new Map([
            ['Naam', 'Category 1'],
            ['Slug', 'category-1'],
            ['Beschrijving', 'Description 1'],
          ]),
        },
      ]);
    });

    test('Convert a CategoryFormValue into FormData object', () => {
      const category: Category = {
        id: '1',
        name: { en: 'Category 1', nl: 'Categorie 1' },
        slug: { en: 'category-1', nl: 'categorie-1' },
        description: { en: 'Description 1', nl: 'Beschrijving 1' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const formData = convertCategoryFormValuesToFormData(category);

      expect(formData.get('id')).toEqual('1');
      expect(formData.get('name.en')).toEqual('Category 1');
      expect(formData.get('name.nl')).toEqual('Categorie 1');
      expect(formData.get('slug.en')).toEqual('category-1');
      expect(formData.get('slug.nl')).toEqual('categorie-1');
      expect(formData.get('description.en')).toEqual('Description 1');
      expect(formData.get('description.nl')).toEqual('Beschrijving 1');
    });

    test('Convert FormData to CategoryFormValue', () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name.en', 'Category 1');
      formData.append('name.nl', 'Categorie 1');
      formData.append('slug.en', 'category-1');
      formData.append('slug.nl', 'categorie-1');
      formData.append('description.en', 'Description 1');
      formData.append('description.nl', 'Beschrijving 1');

      const category = convertFormDataToCategoryFormValues(formData);

      expect(category).toEqual<CategoryFormValues>({
        id: '1',
        name: { en: 'Category 1', nl: 'Categorie 1' },
        slug: { en: 'category-1', nl: 'categorie-1' },
        description: { en: 'Description 1', nl: 'Beschrijving 1' },
      });
    });
  });

  describe('Tools', () => {
    test('Convert a list of tools from the database into table data', () => {
      const tools: ToolWithCategories[] = [
        {
          id: '1',
          name: { en: 'Tool 1', nl: 'Tool 1' },
          slug: { en: 'tool-1', nl: 'tool-1' },
          description: { en: 'Content 1', nl: 'Inhoud 1' },
          filename: '/portal/tools/tool.pdf',
          image: '/portal/tools/tool.jpg',
          summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
          categories: [
            {
              id: '1',
              name: { en: 'Category 1', nl: 'Categorie 1' },
            },
            {
              id: '2',
              name: { en: 'Category 2', nl: 'Categorie 2' },
            },
          ],
        },
      ];

      const [columns, data] = convertToolListToTableData(tools, 'en');

      expect(columns).toEqual(['Naam', 'Slug', 'Samenvatting', 'Categorieën']);

      expect(data).toEqual([
        {
          id: '1',
          data: new Map([
            ['Naam', 'Tool 1'],
            ['Slug', 'tool-1'],
            ['Samenvatting', 'Summary 1'],
            ['Categorieën', 'Category 1, Category 2'],
          ]),
        },
      ]);
    });

    test('Convert a ToolFormValue into FormData object', () => {
      const tool: ToolFormValues = {
        id: '1',
        name: { en: 'Tool 1', nl: 'Tool 1' },
        slug: { en: 'tool-1', nl: 'tool-1' },
        description: { en: 'Content 1', nl: 'Inhoud 1' },
        filename: '/portal/tools/tool.pdf',
        image: '/portal/tools/tool.jpg',
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        categories: ['1', '2'],
      };

      const formData = convertToolFormValuesToFormData(tool);

      expect(formData.get('id')).toEqual('1');
      expect(formData.get('name.en')).toEqual('Tool 1');
      expect(formData.get('name.nl')).toEqual('Tool 1');
      expect(formData.get('slug.en')).toEqual('tool-1');
      expect(formData.get('slug.nl')).toEqual('tool-1');
      expect(formData.get('description.en')).toEqual('Content 1');
      expect(formData.get('description.nl')).toEqual('Inhoud 1');
      expect(formData.get('summary.en')).toEqual('Summary 1');
      expect(formData.get('summary.nl')).toEqual('Samenvatting 1');
      expect(formData.get('categories')).toEqual('1,2');
      expect(formData.get('filename')).toBeNull();
      expect(formData.get('image')).toBeNull();
    });

    test('Convert FormData to ToolFormValue', () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name.en', 'Tool 1');
      formData.append('name.nl', 'Tool 1');
      formData.append('slug.en', 'tool-1');
      formData.append('slug.nl', 'tool-1');
      formData.append('description.en', 'Content 1');
      formData.append('description.nl', 'Inhoud 1');
      formData.append('tool', '/portal/tools/tool.pdf');
      formData.append('image', '/portal/tools/tool.jpg');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('categories', '1,2');

      const tool = convertFormDataIntoToolFormValues(formData);

      expect(tool).toEqual<ToolFormValues>({
        id: '1',
        name: { en: 'Tool 1', nl: 'Tool 1' },
        slug: { en: 'tool-1', nl: 'tool-1' },
        description: { en: 'Content 1', nl: 'Inhoud 1' },
        filename: '/portal/tools/tool.pdf',
        image: '/portal/tools/tool.jpg',
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        categories: ['1', '2'],
      });
    });

    test('Convert FormData to ToolFormValue with empty categories', () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name.en', 'Tool 1');
      formData.append('name.nl', 'Tool 1');
      formData.append('slug.en', 'tool-1');
      formData.append('slug.nl', 'tool-1');
      formData.append('description.en', 'Content 1');
      formData.append('description.nl', 'Inhoud 1');
      formData.append('tool', '/portal/tools/tool.pdf');
      formData.append('image', '/portal/tools/tool.jpg');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('categories', '');

      const tool = convertFormDataIntoToolFormValues(formData);

      expect(tool).toEqual<ToolFormValues>({
        id: '1',
        name: { en: 'Tool 1', nl: 'Tool 1' },
        slug: { en: 'tool-1', nl: 'tool-1' },
        description: { en: 'Content 1', nl: 'Inhoud 1' },
        filename: '/portal/tools/tool.pdf',
        image: '/portal/tools/tool.jpg',
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        categories: [],
      });
    });

    test('Convert FormData to ToolFormValue without image or tool', () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name.en', 'Tool 1');
      formData.append('name.nl', 'Tool 1');
      formData.append('slug.en', 'tool-1');
      formData.append('slug.nl', 'tool-1');
      formData.append('description.en', 'Content 1');
      formData.append('description.nl', 'Inhoud 1');
      formData.append('tool', 'undefined');
      formData.append('image', 'undefined');
      formData.append('summary.en', 'Summary 1');
      formData.append('summary.nl', 'Samenvatting 1');
      formData.append('categories', '');

      const tool = convertFormDataIntoToolFormValues(formData);

      expect(tool).toEqual<ToolFormValues>({
        id: '1',
        name: { en: 'Tool 1', nl: 'Tool 1' },
        slug: { en: 'tool-1', nl: 'tool-1' },
        description: { en: 'Content 1', nl: 'Inhoud 1' },
        filename: '',
        image: '',
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        categories: [],
      });
    });

    test('Converting the tool data from Prisma to a ToolFormValue', () => {
      const toolFromPrisma: Awaited<ReturnType<typeof getToolByID>> = {
        id: '1',
        name: { en: 'Tool 1', nl: 'Tool 1' },
        slug: { en: 'tool-1', nl: 'tool-1' },
        description: { en: 'Content 1', nl: 'Inhoud 1' },
        filename: '/portal/tools/tool.pdf',
        image: '/portal/tools/tool.jpg',
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        categories: [
          {
            id: '1',
            name: { en: 'Category 1', nl: 'Categorie 1' },
            slug: { en: 'category-1', nl: 'categorie-1' },
            description: { en: 'Description 1', nl: 'Beschrijving 1' },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            name: { en: 'Category 2', nl: 'Categorie 2' },
            slug: { en: 'category-2', nl: 'categorie-2' },
            description: { en: 'Description 2', nl: 'Beschrijving 2' },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const tool = convertPrismaToolDataToToolFormValues(toolFromPrisma);

      expect(tool).toEqual<ToolFormValues>({
        id: '1',
        name: { en: 'Tool 1', nl: 'Tool 1' },
        slug: { en: 'tool-1', nl: 'tool-1' },
        description: { en: 'Content 1', nl: 'Inhoud 1' },
        filename: '/portal/tools/tool.pdf',
        image: '/portal/tools/tool.jpg',
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        categories: ['1', '2'],
      });
    });
  });

  describe('Organisations', () => {
    test('Convert a list of organisations from the database into table data', () => {
      const organisations: SerializeFrom<OrganisationsWithUserCount>[] = [
        {
          id: '1',
          name: 'Organisation 1',
          description: 'Description 1',
          createdAt: '',
          updatedAt: '',
          _count: { users: 2 },
        },
      ];

      const [columns, data] = convertOrganisationListToTableData(organisations);

      expect(columns).toEqual(['Naam', 'Beschrijving', 'Aantal gebruikers']);

      expect(data).toEqual([
        {
          id: '1',
          data: new Map([
            ['Naam', 'Organisation 1'],
            ['Beschrijving', 'Description 1'],
            ['Aantal gebruikers', '2'],
          ]),
        },
      ]);
    });

    test('Convert an organisation form value to form data', () => {
      const organisation = {
        id: '1',
        name: 'Organisation 1',
        description: 'Description 1',
      };

      const formData = convertOrganisationFormValuesToFormData(organisation);

      expect(formData.get('id')).toEqual('1');
      expect(formData.get('name')).toEqual('Organisation 1');
      expect(formData.get('description')).toEqual('Description 1');
    });

    test('Convert form data to organisation form values', () => {
      const formData = new FormData();
      formData.append('id', '1');
      formData.append('name', 'Organisation 1');
      formData.append('description', 'Description 1');

      const organisation = convertFormDataToOrganisationFormValues(formData);

      expect(organisation).toEqual({
        id: '1',
        name: 'Organisation 1',
        description: 'Description 1',
      });
    });
  });

  describe('Projects', () => {
    test('Convert a list of projects from the database into table data', () => {
      const projects: SerializeFrom<ProjectsWithOrganisationAndUsers>[] = [
        {
          id: '1',
          name: 'Project 1',
          description: 'Description 1',
          organisation: {
            name: 'Organisation 1',
          },
          users: [
            {
              firstName: 'Kaylee',
              lastName: 'Rosalina',
            },
            {
              firstName: 'Lisa',
              lastName: 'Janssen',
            },
          ],
          organisationId: '1',
          createdAt: '',
          updatedAt: '',
        },
      ];

      const [columns, data] = convertProjectListToTableData(projects);

      expect(columns).toEqual([
        'Naam',
        'Beschrijving',
        'Organisatie',
        'Deelnemers',
      ]);

      expect(data).toEqual([
        {
          id: '1',
          data: new Map([
            ['Naam', 'Project 1'],
            ['Beschrijving', 'Description 1'],
            ['Organisatie', 'Organisation 1'],
            ['Deelnemers', 'Kaylee Rosalina, Lisa Janssen'],
          ]),
        },
      ]);
    });

    test('Convert a project form value to form data', () => {
      const project = {
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
        organisationId: '1',
      };

      const formData = convertProjectFormValuesToFormData(project);

      expect(formData.get('id')).toEqual('1');
      expect(formData.get('name')).toEqual('Project 1');
      expect(formData.get('description')).toEqual('Description 1');
      expect(formData.get('organisationId')).toEqual('1');
    });
  });

  describe('Users', () => {
    test('Convert a list of users from the database into table data', () => {
      const users: SerializeFrom<UserWithProjectsAndOrgs>[] = [
        {
          id: '1',
          firstName: 'Kaylee',
          lastName: 'Rosalina',
          email: 'hallo@kayleerosalina.nl',
          role: 'ADMIN',
          locale: 'nl',
          avatarUrl: '',
          organisation: {
            id: '1',
            name: 'Organisation 1',
          },
          organisationId: '1',
          projects: [
            {
              id: '1',
              name: 'Project 1',
            },
          ],
          createdAt: '',
          updatedAt: '',
        },
      ];

      const [columns, data] = convertUserListToTableData(users);

      expect(columns).toEqual([
        'Voornaam',
        'Achternaam',
        'E-mailadres',
        'Rol',
        'Organisatie',
        'Projecten',
      ]);

      expect(data).toEqual([
        {
          id: '1',
          data: new Map([
            ['Voornaam', 'Kaylee'],
            ['Achternaam', 'Rosalina'],
            ['E-mailadres', 'hallo@kayleerosalina.nl'],
            ['Rol', 'Administrator'],
            ['Organisatie', 'Organisation 1'],
            ['Projecten', 'Project 1'],
          ]),
        },
      ]);
    });

    test('Convert a user form value to form data', () => {
      const user: UserFormValues = {
        id: '1',
        firstName: 'Kaylee',
        lastName: 'Rosalina',
        email: 'hallo@kayleerosalina.nl',
        role: 'ADMIN',
        locale: 'nl',
        avatarUrl: '/path/to/avatar',
        organisationId: '1',
      };

      const formData = convertUserFormValuesToFormData(user);

      expect(formData.get('id')).toEqual('1');
      expect(formData.get('firstName')).toEqual('Kaylee');
      expect(formData.get('lastName')).toEqual('Rosalina');
      expect(formData.get('email')).toEqual('hallo@kayleerosalina.nl');
      expect(formData.get('role')).toEqual('ADMIN');
      expect(formData.get('locale')).toEqual('nl');
      expect(formData.get('avatarUrl')).toEqual('/path/to/avatar');
      expect(formData.get('organisationId')).toEqual('1');
    });
  });

  describe('Miscellaneous', () => {
    test('Converting an article or a tool to an item for the card overview', () => {
      const article: SummarisedArticle = {
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        author: {
          id: '1',
          firstName: 'Kaylee',
          lastName: 'Rosalina',
        },
        categories: [
          {
            id: '1',
            name: { en: 'Category 1', nl: 'Categorie 1' },
            slug: { en: 'category-1', nl: 'categorie-1' },
          },
        ],
        image: '/path/to/image',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const tool: SummarisedTool = {
        id: '1',
        name: { en: 'Tool 1', nl: 'Tool 1' },
        slug: { en: 'tool-1', nl: 'tool-1' },
        image: '/portal/tools/tool.jpg',
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        categories: [
          {
            id: '1',
            name: { en: 'Category 1', nl: 'Categorie 1' },
            slug: { en: 'category-1', nl: 'categorie-1' },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const articleItem = convertArticleOrToolToItem(article, 'article');
      const toolItem = convertArticleOrToolToItem(tool, 'tool');

      expect(articleItem).toEqual<Item>({
        type: 'article',
        id: '1',
        title: { en: 'Title 1', nl: 'Titel 1' },
        slug: { en: 'title-1', nl: 'titel-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        image: '/path/to/image',
        updatedAt: article.updatedAt.toISOString(),
        categories: [
          {
            id: '1',
            name: { en: 'Category 1', nl: 'Categorie 1' },
            slug: { en: 'category-1', nl: 'categorie-1' },
          },
        ],
        author: {
          id: '1',
          firstName: 'Kaylee',
          lastName: 'Rosalina',
        },
      });

      expect(toolItem).toEqual<Item>({
        type: 'tool',
        id: '1',
        title: { en: 'Tool 1', nl: 'Tool 1' },
        slug: { en: 'tool-1', nl: 'tool-1' },
        summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
        image: '/portal/tools/tool.jpg',
        updatedAt: tool.updatedAt.toISOString(),
        categories: [
          {
            id: '1',
            name: { en: 'Category 1', nl: 'Categorie 1' },
            slug: { en: 'category-1', nl: 'categorie-1' },
          },
        ],
      });
    });
  });
});
