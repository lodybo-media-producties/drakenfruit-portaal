import type { Preview } from '@storybook/react';
import i18n from './i18n-storybook';

import '../app/tailwind.css';

import { withThemeByClassName } from '@storybook/addon-styling';
import {
  unstable_createRemixStub as createRemixStub,
  RemixStubProps,
} from '@remix-run/testing';

const preview: Preview = {
  globals: {
    locale: 'en',
    locales: {
      en: 'English',
      nl: 'Nederlands',
    },
  },
  parameters: {
    i18n,
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    deepControls: { enabled: true },
    layout: 'centered',
    backgrounds: {
      default: 'egg-white',
      values: [
        { name: 'dark-blue', value: '#6F8D9C' },
        { name: 'light-blue', value: '#BDCACF' },
        { name: 'egg-white', value: '#FDF7F4' },
        { name: 'light-pink', value: '#F6CAC9' },
        { name: 'dark-pink', value: '#C4475C' },
        { name: 'orange', value: '#F4B855' },
      ],
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Documentation', ['Drakenfruit Portal', '*'], 'Components'],
        locale: 'en-US',
      },
    },
  },

  decorators: [
    // Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    // @ts-ignore
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),

    // Enable Remix stubbing for routes, for the components that depend on them.
    (story, context) => {
      const routes = context.args.remixStub?.routes ?? [{ path: '/' }];
      const initialEntries = context.args.remixStub?.initialEntries ?? ['/'];

      const RemixStub = createRemixStub(
        routes.map((route: any) => ({
          ...route,
          Component() {
            return story();
          },
        }))
      );

      return <RemixStub initialEntries={initialEntries} />;
    },
  ],
};

export default preview;
