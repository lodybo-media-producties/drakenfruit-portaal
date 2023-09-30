import type { Meta, StoryObj } from '@storybook/react';
import Notification from './Notification';

export default {
  title: 'Components/Notification',
  component: Notification,
} satisfies Meta<typeof Notification>;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  args: {

  },
};
