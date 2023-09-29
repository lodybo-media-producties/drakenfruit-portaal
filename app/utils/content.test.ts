import { describe, test } from 'vitest';
import { type ArticlesWithCategoriesSummaryList } from '~/models/articles.server';
import { convertArticleListToTableData } from '~/utils/content';

describe('Content utilities', () => {
  describe('Articles', () => {
    test('Convert an array of articles to table data', () => {
      const articles: ArticlesWithCategoriesSummaryList[] = [
        {
          id: '1',
          title: { en: 'Title 1', nl: 'Titel 1' },
          summary: { en: 'Summary 1', nl: 'Samenvatting 1' },
          author: 'Kaylee Rosalina',
          content: { en: 'Content 1', nl: 'Inhoud 1' },
          createdAt: new Date(),
          updatedAt: new Date(),
          categories: [
            {
              id: '1',
              name: { en: 'Category 1', nl: 'Categorie 1' },
            },
          ],
          image: null,
        },
      ];

      const [columns, data] = convertArticleListToTableData(articles);

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
  });
});
