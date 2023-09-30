import { type ActionFunctionArgs, json } from '@remix-run/node';
import { requireUserWithMinimumRole } from '~/session.server';
import { convertFormDataToArticleFormValues } from '~/utils/content';
import { prisma } from '~/db.server';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';
import i18nextServer from '~/i18next.server';

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const t = i18nextServer.getFixedT(request, 'routes');

  const formData = await request.formData();

  if (request.method === 'POST') {
    const data = convertFormDataToArticleFormValues(formData);
    console.log(data);
  }

  if (request.method === 'PUT') {
  }

  if (request.method === 'DELETE') {
    console.log(Object.fromEntries(formData.entries()));
    const id = (formData.get('id') as string | undefined) ?? {};

    if (!id) {
      return json<APIResponse>({
        ok: false,
        message: t('Articles.API.Delete.Error.NoId'),
      });
    } else {
      try {
        await prisma.article.delete({ where: { id } });
        return json<APIResponse>({ ok: true });
      } catch (error) {
        console.error(error);
        const message = getErrorMessage(error);
        return json<APIResponse>({ ok: false, message });
      }
    }
  }

  return json({});
}
