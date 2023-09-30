import { createCookie } from '@remix-run/node';

export const langSessionCookie = createCookie('i18n', {
  path: '/',
  sameSite: 'lax',
});
