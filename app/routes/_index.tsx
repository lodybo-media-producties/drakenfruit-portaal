import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [{ title: 'Drakenfruit' }];

export default function Index() {
  return <main>Hello world!</main>;
}
