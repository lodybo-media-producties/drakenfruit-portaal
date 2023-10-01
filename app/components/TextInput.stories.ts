import type { Meta, StoryObj } from '@storybook/react';
import TextInput from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/Text input',
  component: TextInput,
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    label: 'Please enter your name',
  },
};

export const Required: Story = {
  args: {
    label: 'Please enter your name',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Please enter your name',
    error: 'This is a required field',
  },
};
