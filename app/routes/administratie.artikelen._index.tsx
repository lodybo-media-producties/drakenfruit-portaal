import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import { getArticlesSummaryList } from '~/models/articles.server';
import Button from '~/components/Button';
import { useLoaderData } from '@remix-run/react';
import { convertArticleListToTableData } from '~/utils/content';
import Table from '~/components/Table';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAdmin(request);

  const articles = await getArticlesSummaryList();

  return json({ user, articles });
}

export default function ArticlesIndexRoute() {
  const { articles } = useLoaderData<typeof loader>();
  const [columns, data] = convertArticleListToTableData(articles);

  const handleDelete = (id: string) => {
    console.log(`Deleting article with id ${id}`);
  };

  const handleEdit = (id: string) => {
    console.log(`Editing article with id ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-4xl">Artikelen</h1>

        <Button to="/administratie/artikelen/nieuw">Nieuw artikel</Button>
      </div>

      {articles.length > 0 ? (
        <Table
          columns={columns}
          tableData={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <p>Er zijn nog geen artikelen aangemaakt.</p>
      )}
    </div>
  );
}
