import { type ActionFunctionArgs, json } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import { convertFormDataToArticleFormValues } from '~/utils/content';

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const data = convertFormDataToArticleFormValues(formData);

  console.log(data);

  return json({});
}
