import type { V2_MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: V2_MetaFunction = () => [{ title: 'Drakenfruit' }];

export default function Index() {
  return <main>Hello world!</main>;
}
