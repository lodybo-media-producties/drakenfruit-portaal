import type { Meta, StoryObj } from '@storybook/react';
import Loader from './Loader';

export default {
  title: 'Components/Loader',
  component: Loader,
  argTypes: {
    sizes: {
      options: ['s', 'm', 'l', 'xl', '2xl', '3xl', 'full'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Loader>;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {
    light: false,
    sizes: 'm',
  },
};

export const Light: Story = {
  name: 'Light mode',
  args: {
    light: true,
  },
  parameters: {
    backgrounds: {
      default: 'dark-pink',
    },
  },
};

export const Sizes: Story = {
  args: {
    sizes: 'full',
  },
};
