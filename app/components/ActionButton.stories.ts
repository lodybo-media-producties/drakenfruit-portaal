import type { Meta, StoryObj } from '@storybook/react';
import ActionButton from '~/components/ActionButton';

export default {
  title: 'Components/Action Button',
  component: ActionButton,
} satisfies Meta<typeof ActionButton>;

type Story = StoryObj<typeof ActionButton>;

export const Default: Story = {
  args: {
    icon: 'pen',
  },
};

export const Destructive: Story = {
  args: {
    icon: 'trash-alt',
    destructive: true,
  },
};
