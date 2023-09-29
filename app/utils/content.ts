import { type ArticlesWithCategoriesSummaryList } from '~/models/articles.server';
import { type Columns, type TableData } from '~/components/Table';

export function convertArticleListToTableData(
  articles: ArticlesWithCategoriesSummaryList[]
): [Columns, TableData[]] {
  const columns: Columns = ['Titel', 'Samenvatting', 'Auteur', 'Categorieën'];

  const data: TableData[] = articles.map((article) => {
    return {
      id: article.id,
      data: new Map([
        ['Titel', article.title.en],
        ['Samenvatting', article.summary.en],
        ['Auteur', article.author],
        [
          'Categorieën',
          article.categories.map((category) => category.name.en).join(', '),
        ],
      ]),
    };
  });

  return [columns, data];
}
