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
    label: 'Label for input',
  },
};
