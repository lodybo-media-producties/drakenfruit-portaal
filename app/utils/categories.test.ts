import { describe, test } from 'vitest';
import { type Category } from '~/models/categories.server';
import { convertPrismaCategoriesToCategorySelection } from '~/utils/categories';
import { type CategorySelection } from '~/components/CategoryInput';

describe('Categoriy utils', () => {
  test('Converting categories from Prisma to CategorySelection', () => {
    const categoriesFromDb: Category[] = [
      {
        id: '1',
        name: {
          nl: 'Categorie 1',
          en: 'Category 1',
        },
        slug: {
          nl: 'categorie-1',
          en: 'category-1',
        },
        description: {
          nl: 'Dit is categorie 1',
          en: 'This is category 1',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: {
          nl: 'Categorie 2',
          en: 'Category 2',
        },
        slug: {
          nl: 'categorie-2',
          en: 'category-2',
        },
        description: {
          nl: 'Dit is categorie 2',
          en: 'This is category 2',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const categories =
      convertPrismaCategoriesToCategorySelection(categoriesFromDb);

    expect(categories).toEqual<CategorySelection[]>([
      {
        id: '1',
        name: {
          nl: 'Categorie 1',
          en: 'Category 1',
        },
      },
      {
        id: '2',
        name: {
          nl: 'Categorie 2',
          en: 'Category 2',
        },
      },
    ]);
  });
});
