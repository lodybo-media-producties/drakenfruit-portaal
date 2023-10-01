import type { Meta, StoryObj } from '@storybook/react';
import TextAreaInput from './TextAreaInput';

const meta: Meta<typeof TextAreaInput> = {
  title: 'Components/Text area input',
  component: TextAreaInput,
};

export default meta;

type Story = StoryObj<typeof TextAreaInput>;

export const Default: Story = {
  args: {
    label: 'Write a small bio',
  },
};

export const Required: Story = {
  args: {
    label: 'Write a small bio',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Write a small bio',
    error: 'The bio is too long',
  },
};
