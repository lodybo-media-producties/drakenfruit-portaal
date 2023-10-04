import { type ActionFunctionArgs, json, redirect } from '@remix-run/node';
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
import { type Prisma } from '@prisma/client';

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const t = await i18nextServer.getFixedT(request, 'routes');

  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  if (request.method === 'POST') {
    const validationResults = await validateTool(request);

    if (!validationResults.success) {
      return json<ToolErrors>(validationResults.errors, { status: 400 });
    } else {
      const data = convertFormDataIntoToolFormValues(formData);

      console.log(data);
      try {
        await prisma.tool.create({
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            summary: data.summary,
            downloadUrl: data.downloadUrl,
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
    const validationResults = await validateTool(request);

    if (!validationResults.success) {
      return json<ToolErrors>(validationResults.errors, { status: 400 });
    } else {
      const toolFormValues = convertFormDataIntoToolFormValues(formData);

      const data: Prisma.ToolUpdateInput = {
        id: toolFormValues.id,
        name: toolFormValues.name,
        slug: toolFormValues.slug,
        description: toolFormValues.description,
      };

      try {
        await prisma.tool.update({
          where: {
            id: toolFormValues.id,
          },
          data,
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Tools.API.UPDATE.Success.Title'),
          description: t('Tools.API.UPDATE.Success.Message'),
        });

        return redirect('/administratie/tools', {
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
