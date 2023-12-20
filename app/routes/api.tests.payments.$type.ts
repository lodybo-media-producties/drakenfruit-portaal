import { getiDEALIssuers, getPaymentMethods } from '~/payments.server';
import { json, type LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ params }: LoaderFunctionArgs) {
  const { type } = params;

  switch (type) {
    case 'methods':
      return json(await getPaymentMethods());
    case 'issuers':
      return json(await getiDEALIssuers());
    default:
      return json({ error: 'Invalid payment type' }, { status: 400 });
  }
}
