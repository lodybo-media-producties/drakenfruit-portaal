import { type Category } from '~/models/categories.server';
import { type CategorySelection } from '~/components/CategoryInput';

export function convertPrismaCategoriesToCategorySelection(
  categories: Category[]
): CategorySelection[] {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
}
