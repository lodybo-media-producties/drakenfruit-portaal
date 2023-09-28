import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireAdmin } from '~/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAdmin(request);

  return json({ user });
}

export default function ArticlesIndexRoute() {
  return (
    <div>
      <h1 className="font-heading text-4xl">Artikelen</h1>
    </div>
  );
}
