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
import { type Prisma } from '@prisma/client';
import { validateArticle } from '~/validations/flows';
import { type ArticleErrors } from '~/types/Validations';
import {
  articleUploadHandler,
  type UploadState,
} from '~/models/storage.server';
// @ts-ignore
import { eventStream } from 'remix-utils/event-stream';
import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/server-runtime';

let currentUpload: UploadState | null = null;

function setCurrentUpload(progress: UploadState) {
  currentUpload = progress;
}
export async function loader({ request }: ActionFunctionArgs) {
  return eventStream(request.signal, (send: any) => {
    let timer = setInterval(() => {
      if (currentUpload) {
        send({
          event: 'upload-progress',
          data: JSON.stringify(currentUpload),
        });
      }
    }, 100);

    return () => {
      clearInterval(timer);
      currentUpload = null;
    };
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const t = await i18nextServer.getFixedT(request, 'routes');

  const clonedRequest = request.clone();

  if (request.method === 'POST') {
    const validationResults = await validateArticle(request);

    if (!validationResults.success) {
      return json<ArticleErrors>(validationResults.errors, { status: 400 });
    } else {
      setCurrentUpload({
        state: 'prepare',
      });

      try {
        const uploadHandler = composeUploadHandlers(
          (args) =>
            articleUploadHandler({
              ...args,
              callback: (args) => {
                setCurrentUpload(args);
              },
            }),
          createMemoryUploadHandler()
        );

        const formData = await parseMultipartFormData(
          clonedRequest,
          uploadHandler
        );

        const data = convertFormDataToArticleFormValues(formData);
        const mode = formData.get('mode') as string | undefined;

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
  }

  if (request.method === 'PUT') {
    const formData = await clonedRequest.formData();
    const mode = formData.get('mode') as string | undefined;
    const validationResults = await validateArticle(request);

    if (!validationResults.success) {
      return json<ArticleErrors>(validationResults.errors, { status: 400 });
    } else {
      const articleFormValues = convertFormDataToArticleFormValues(formData);

      const data: Prisma.ArticleUpdateInput = {
        id: articleFormValues.id,
        title: articleFormValues.title,
        slug: articleFormValues.slug,
        content: articleFormValues.content,
        summary: articleFormValues.summary,
        published: mode === 'publish',
        image: articleFormValues.image,
        author: {
          connect: {
            id: articleFormValues.authorId,
          },
        },
      };

      if (articleFormValues.categories.length > 0) {
        data.categories = {
          set: articleFormValues.categories.map((category) => ({
            id: category,
          })),
        };
      }

      try {
        await prisma.article.update({
          where: {
            id: articleFormValues.id,
          },
          data,
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Articles.API.UPDATE.Success.Title'),
          description: t('Articles.API.UPDATE.Success.Message'),
        });

        return redirect('/administratie/artikelen', {
          headers: {
            'Set-Cookie': await commitSession(session),
          },
        });
      } catch (error) {
        const message = getErrorMessage(error);
        return json<APIResponse>({ ok: false, message }, { status: 500 });
      }
    }
  }

  if (request.method === 'DELETE') {
    const formData = await clonedRequest.formData();
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
