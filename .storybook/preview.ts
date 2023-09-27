import type { Preview } from '@storybook/react';
import i18n from './i18n-storybook';

import '../app/tailwind.css';

import { withThemeByClassName } from '@storybook/addon-styling';

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
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: ['Documentation', 'Components'],
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
  ],
};

export default preview;
