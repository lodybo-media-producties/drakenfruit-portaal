import type { LoaderFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  return null;
}

export default function AccountMainPage() {
  return <h1>Hello World!</h1>;
}
