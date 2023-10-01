import { describe, test } from 'vitest';
import {
  type ArticlesWithCategoriesSummaryList,
  type getArticleById,
} from '~/models/articles.server';
import {
  convertArticleListToTableData,
  convertArticleFormValuesToFormData,
  convertFormDataToArticleFormValues,
  convertPrismaArticleToArticleFormValues,
  convertCategoryListToTableData,
  convertCategoryFormValuesToFormData,
  convertFormDataToCategoryFormValues,
} from '~/utils/content';
import { type Category } from '~/models/categories.server';
import { type ArticleFormValues } from '~/types/Article';
import { type CategoryFormValues } from '~/types/Category';

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
          image: null,
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
      expect(formData.get('image')).toEqual('/path/to/image.jpg');
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
        published: false,
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
