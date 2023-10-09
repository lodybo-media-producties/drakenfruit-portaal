import {
  type ActionFunctionArgs,
  json,
  redirect,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node';
import {
  getSession,
  requireUserWithMinimumRole,
  commitSession,
} from '~/session.server';
import { convertFormDataIntoToolFormValues } from '~/utils/content';
import { prisma } from '~/db.server';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';
import i18nextServer from '~/i18next.server';
import { validateTool } from '~/validations/flows';
import { type ToolErrors } from '~/types/Validations';
import { toolUploadHandler, type UploadState } from '~/models/storage.server';
// @ts-ignore
import { eventStream } from 'remix-utils/event-stream';

// TODO: Instead of rewriting this in other api's, make this reusable.
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
    // TODO: We parse formData twice, once here during validate and once during multipart. This is not ideal.
    const validationResults = await validateTool(request);

    if (!validationResults.success) {
      return json<ToolErrors>(validationResults.errors, { status: 400 });
    } else {
      setCurrentUpload({
        state: 'prepare',
      });

      try {
        const uploadHandler = composeUploadHandlers(
          (args) =>
            toolUploadHandler({
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

        const data = convertFormDataIntoToolFormValues(formData);
        await prisma.tool.create({
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            summary: data.summary,
            filename: data.filename,
            image: data.image,
            categories: {
              connect: data.categories.map((category) => ({
                id: category,
              })),
            },
          },
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Tools.API.CREATE.Success.Title'),
          description: t('Tools.API.CREATE.Success.Message'),
        });

        return redirect('/administratie/tools', {
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
    const editCheckRequest = request.clone();
    // TODO: Fix validation when editing a tool. Filename or image are not required.
    const validationResults = await validateTool(request);

    if (!validationResults.success) {
      return json<ToolErrors>(validationResults.errors, { status: 400 });
    } else {
      setCurrentUpload({
        state: 'prepare',
      });

      try {
        const editedFormData = await editCheckRequest.formData();
        const filenameHasBeenEdited = editedFormData.get(
          'filenameHasBeenEdited'
        );
        const imageHasBeenEdited = editedFormData.get('imageHasBeenEdited');

        const uploadHandler = composeUploadHandlers(
          (args) =>
            toolUploadHandler({
              ...args,
              callback: (args) => {
                setCurrentUpload(args);
              },
              runHandler:
                (!!filenameHasBeenEdited && filenameHasBeenEdited === 'true') ||
                (!!imageHasBeenEdited && imageHasBeenEdited === 'true'),
            }),
          createMemoryUploadHandler()
        );

        const formData = await parseMultipartFormData(
          clonedRequest,
          uploadHandler
        );

        const data = convertFormDataIntoToolFormValues(formData);
        await prisma.tool.create({
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            summary: data.summary,
            filename: data.filename,
            image: data.image,
            categories: {
              connect: data.categories.map((category) => ({
                id: category,
              })),
            },
          },
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Tools.API.CREATE.Success.Title'),
          description: t('Tools.API.CREATE.Success.Message'),
        });

        return redirect('/administratie/tools', {
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

  if (request.method === 'DELETE') {
    const formData = await clonedRequest.formData();
    const id = (formData.get('id') as string | undefined) ?? '';

    if (!id) {
      return json<APIResponse>({
        ok: false,
        message: t('Tools.API.Delete.Error.NoId'),
      });
    } else {
      try {
        await prisma.tool.delete({
          where: {
            id,
          },
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Tools.API.DELETE.Success.Title'),
          description: t('Tools.API.DELETE.Success.Message'),
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
