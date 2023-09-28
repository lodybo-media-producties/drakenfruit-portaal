import type { Meta, StoryObj } from '@storybook/react';
import Icon from '~/components/Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'chevron-right',
  },
  argTypes: {
    // TODO: Add missing argtypes
    prefix: {
      defaultValue: 'fas',
    },
  },
};
