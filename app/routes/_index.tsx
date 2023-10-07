import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import type { Filter } from '~/components/SearchFilters';
import SearchFilters from '~/components/SearchFilters';
import { getSummarisedArticles } from '~/models/articles.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ArticleCard from '~/components/ArticleCard';

export const meta: MetaFunction = () => [{ title: 'Drakenfruit' }];

export async function loader({ request }: LoaderFunctionArgs) {
  const articles = await getSummarisedArticles();

  return json({ articles });
}

export default function Index() {
  const { t } = useTranslation();
  const { articles } = useLoaderData<typeof loader>();

  const filters: Filter[] = [
    {
      slug: 'accessibility',
      label: t('SearchFilters.Accessibility'),
      defaultChecked: true,
    },
    { slug: 'measurements', label: t('SearchFilters.Measurements') },
    {
      slug: 'project-management',
      label: t('SearchFilters.Project Management'),
    },
    { slug: 'tools', label: t('SearchFilters.Tools') },
    { slug: 'webinars', label: t('SearchFilters.Webinars') },
  ];

  return (
    <div className="px-8 pt-12">
      <SearchFilters filters={filters} onSelectedFiltersChange={() => {}} />

      <div className="max-w-full w-[75vw] mx-auto grid grid-cols-3 gap-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
