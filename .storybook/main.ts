import type { StorybookConfig } from '@storybook/react-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: [
    '../docs/**/*.mdx',
    '../app/components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-styling',
      options: {},
    },
    'storybook-react-i18next',
    'storybook-addon-deep-controls',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: 'Components',
  },
  viteFinal: async (config) => {
    if (config.build) {
      config.build.target = 'esnext';
    }

    config.plugins?.push(tsconfigPaths());
    return config;
  },
};
export default config;
