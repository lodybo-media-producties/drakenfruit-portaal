import { type ActionFunctionArgs, json, redirect } from '@remix-run/node';
import {
  getSession,
  requireUserWithMinimumRole,
  commitSession,
} from '~/session.server';
import { convertFormDataToCategoryFormValues } from '~/utils/content';
import { prisma } from '~/db.server';
import { type APIResponse } from '~/types/Responses';
import { getErrorMessage } from '~/utils/utils';
import i18nextServer from '~/i18next.server';
import { validateCategory } from '~/validations/flows';
import { type CategoryErrors } from '~/types/Validations';
import { type Prisma } from '@prisma/client';

export async function action({ request }: ActionFunctionArgs) {
  await requireUserWithMinimumRole('CONSULTANT', request);

  const t = await i18nextServer.getFixedT(request, 'routes');

  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  if (request.method === 'POST') {
    const validationResults = await validateCategory(request);

    if (!validationResults.success) {
      return json<CategoryErrors>(validationResults.errors, { status: 400 });
    } else {
      const data = convertFormDataToCategoryFormValues(formData);

      try {
        await prisma.category.create({
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
          },
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Categories.API.CREATE.Success.Title'),
          description: t('Categories.API.CREATE.Success.Message'),
        });

        return redirect('/administratie/categorieen', {
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
    const validationResults = await validateCategory(request);

    if (!validationResults.success) {
      return json<CategoryErrors>(validationResults.errors, { status: 400 });
    } else {
      const categoryFormValues = convertFormDataToCategoryFormValues(formData);

      const data: Prisma.CategoryUpdateInput = {
        id: categoryFormValues.id,
        name: categoryFormValues.name,
        slug: categoryFormValues.slug,
        description: categoryFormValues.description,
      };

      try {
        await prisma.category.update({
          where: {
            id: categoryFormValues.id,
          },
          data,
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Categories.API.UPDATE.Success.Title'),
          description: t('Categories.API.UPDATE.Success.Message'),
        });

        return redirect('/administratie/categorieen', {
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
        message: t('Categories.API.Delete.Error.NoId'),
      });
    } else {
      try {
        await prisma.category.delete({
          where: {
            id,
          },
        });

        const session = await getSession(request);
        session.flash('toast', {
          title: t('Categories.API.DELETE.Success.Title'),
          description: t('Categories.API.DELETE.Success.Message'),
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
