import { type ActionFunctionArgs, json } from '@remix-run/node';
import { requireAdmin } from '~/session.server';

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const data = await request.formData();

  console.log(Object.fromEntries(data.entries()));

  return json({});
}
