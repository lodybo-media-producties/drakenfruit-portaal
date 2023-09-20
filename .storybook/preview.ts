import type { Preview } from '@storybook/react';

import '../app/tailwind.css';

import { withThemeByClassName } from '@storybook/addon-styling';
const preview: Preview = {
  parameters: {
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
