import { type ActionFunctionArgs, json } from '@remix-run/node';
import { type APIResponse } from '~/types/Responses';
import invariant from 'tiny-invariant';
import { langSessionCookie } from '~/cookies.server';
import { prisma } from '~/db.server';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const data = await request.formData();
    const locale = data.get('locale') as string | null;
    const userID = data.get('userID') as string | null;

    invariant(locale, 'locale is required');

    if (userID) {
      await prisma.user.update({
        where: { id: userID },
        data: { locale },
      });
    }

    return json<APIResponse>(
      { ok: true },
      {
        headers: {
          'Set-Cookie': await langSessionCookie.serialize(locale),
        },
      }
    );
  }

  throw new Error('Method not allowed');
}
