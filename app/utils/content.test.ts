import { describe, test } from 'vitest';
import { type ArticlesWithCategoriesSummaryList } from '~/models/articles.server';
import {
  convertArticleListToTableData,
  convertArticleFormValuesToFormData,
  convertFormDataToArticleFormValues,
} from '~/utils/content';
import { type ArticleFormValues } from '~/components/ArticleMutationForm';

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
      ]);

      expect(data).toEqual([
        {
          id: '1',
          data: new Map([
            ['Titel', 'Title 1'],
            ['Samenvatting', 'Summary 1'],
            ['Auteur', 'Kaylee Rosalina'],
            ['Categorieën', 'Category 1'],
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
  });
});
