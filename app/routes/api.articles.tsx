import { type ActionFunctionArgs, json, redirect } from '@remix-run/node';
import {
  getSession,
  requireUserWithMinimumRole,
  commitSession,
} from '~/session.server';
import { convertFormDataToArticleFormValues } from '~/utils/content';
import { prisma } from '~/db.server';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';
import i18nextServer from '~/i18next.server';

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const t = await i18nextServer.getFixedT(request, 'routes');

  const formData = await request.formData();

  if (request.method === 'POST') {
    const mode = formData.get('mode') as string | undefined;
    const data = convertFormDataToArticleFormValues(formData);

    try {
      await prisma.article.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          summary: data.summary,
          published: mode === 'publish',
          image: data.image,
          author: {
            connect: {
              id: data.authorId,
            },
          },
        },
      });

      const session = await getSession(request);
      session.flash('toast', {
        title: t('Articles.API.CREATE.Success.Title'),
        description: t('Articles.API.CREATE.Success.Message'),
      });

      return redirect('/administratie/artikelen', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    } catch (error) {
      const message = getErrorMessage(error);
      return json<APIResponse>(
        {
          ok: false,
          message,
        },
        { status: 500 }
      );
    }
  }

  if (request.method === 'PUT') {
  }

  if (request.method === 'DELETE') {
    const id = (formData.get('id') as string | undefined) ?? '';

    if (!id) {
      return json<APIResponse>({
        ok: false,
        message: t('Articles.API.Delete.Error.NoId'),
      });
    } else {
      try {
        await prisma.article.delete({
          where: {
            id,
          },
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Articles.API.DELETE.Success.Title'),
          description: t('Articles.API.DELETE.Success.Message'),
          destructive: true,
        });

        return json<APIResponse>(
          { ok: true },
          {
            headers: {
              'Set-Cookie': await commitSession(session),
            },
          }
        );
      } catch (error) {
        console.error(error);
        const message = getErrorMessage(error);
        return json<APIResponse>({ ok: false, message }, { status: 500 });
      }
    }
  }

  return json({});
}
