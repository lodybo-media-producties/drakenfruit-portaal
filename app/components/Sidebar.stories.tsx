import { type Meta, type StoryObj } from '@storybook/react';
import Sidebar from '~/components/Sidebar';

const routeMapping = {
  '/': ['/'],
  '/administratie/artikelen': ['/administratie/artikelen'],
};

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    user: {
      table: {
        disable: true,
      },
    },
    'user.role': {
      name: 'User role',
      description: 'The role of the user',
      table: {
        defaultValue: 'ADMIN',
      },
      options: [
        'MAINTAINER',
        'ADMIN',
        'OFFICEMANAGER',
        'CONSULTANT',
        'PROJECTLEADER',
      ],
      control: {
        type: 'select',
      },
    },
    'remixStub.initialEntries': {
      name: 'Initial entries for the router',
      table: {
        category: 'Remix stub',
      },
      options: Object.keys(routeMapping),
      mapping: routeMapping,
      control: {
        type: 'select',
      },
    },
    'remixStub.routes': {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light-blue',
    },
  },
} satisfies Meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    // @ts-ignore
    user: {
      role: 'ADMIN',
    },
    remixStub: {
      initialEntries: ['/'],
      routes: [
        {
          path: '/',
        },
        {
          path: '/administratie/artikelen',
        },
      ],
    },
  },
};
