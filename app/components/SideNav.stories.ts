import type { Meta, StoryObj } from '@storybook/react';
import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing';
import SideNav from './SideNav';

const meta: Meta = {
  title: 'Components/SideNav',
  component: SideNav,
  decorators: [
    (story) => {
      const remixStub = createRemixStub([
        {
          path: '/*',
          action: () => ({ redirect: '/' }),
          loader: () => ({ redirect: '/' }),
          Component: story,
        },
      ]);

      return remixStub({ initialEntries: ['/'] });
    },
  ],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof SideNav>;

export const Default: Story = {
  args: {
    items: [
      { title: 'Articles', to: '/articles', icon: 'rectangle-list' },
      { title: 'Search', to: '/search', icon: 'search' },
    ],
  },
};
