import { type ActionFunctionArgs, json } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const formData = await request.formData();

    const issuer = formData.get('issuer');

    if (!issuer || issuer === '') {
      return json({ message: 'Issuer is required' }, { status: 400 });
    }

    return json({ message: 'SUCCES!' });
  } else {
    throw json({ message: 'Method not allowed' }, { status: 405 });
  }
}
