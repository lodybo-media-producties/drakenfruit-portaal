import { type ActionFunctionArgs, json } from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import { updateBookmarks } from '~/models/user.server';
import invariant from 'tiny-invariant';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUserWithMinimumRole('PROJECTLEADER', request);

  if (request.method !== 'PUT') {
    return json({ message: 'Method not allowed' }, { status: 405 });
  }

  const data = await request.formData();

  try {
    const bookmarkId = data.get('bookmarkId');
    invariant(typeof bookmarkId === 'string', 'bookmarkId is required');

    await updateBookmarks(user.id, bookmarkId);

    return json<APIResponse>({ ok: true }, { status: 200 });
  } catch (error) {
    const message = getErrorMessage(error);
    return json<APIResponse>({ ok: false, message }, { status: 500 });
  }
}
