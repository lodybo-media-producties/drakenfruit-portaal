import type { Meta, StoryObj } from '@storybook/react';
import Message from './Message';

export default {
  title: 'Components/Message',
  component: Message,
} satisfies Meta<typeof Message>;

type Story = StoryObj<typeof Message>;

export const Info: Story = {
  args: {
    variant: 'info',
    message: 'This is an info message',
    subtle: false,
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    message: 'This is an error message',
    subtle: false,
  },
};

export const SubtleInfo: Story = {
  args: {
    variant: 'info',
    message: 'This is a subtle info message',
    subtle: true,
  },
};

export const SubtleError: Story = {
  args: {
    variant: 'error',
    message: 'This is a subtle error message',
    subtle: true,
  },
};
