import { type ActionFunctionArgs, json } from '@remix-run/node';
import i18nextServer from '~/i18next.server';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const locale = await i18nextServer.getLocale(request);

    const formData = await request.formData();

    const issuer = formData.get('issuer');

    if (!issuer || issuer === '') {
      let message: string;

      if (locale === 'nl') {
        message = 'Geen bank geselecteerd';
      } else {
        message = 'No bank selected';
      }

      return json({ message }, { status: 400 });
    }

    return json({ message: 'SUCCES!' });
  } else {
    throw json({ message: 'Method not allowed' }, { status: 405 });
  }
}
