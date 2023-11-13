import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { requireUser } from '~/session.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18next.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const t = await i18next.getFixedT(request, 'routes');
  const metaTranslations = {
    title: t('Account.Index.Meta.Title'),
  };

  return json({ user, metaTranslations });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.metaTranslations.title ?? 'Drakenfruit',
  },
];

export default function AccountMainPage() {
  const { user } = useLoaderData<typeof loader>();
  const { t } = useTranslation('routes');

  return (
    <>
      <h1 className="font-type text-5xl">
        {t('Account.Index.Title', { name: user.firstName })}
      </h1>
    </>
  );
}
