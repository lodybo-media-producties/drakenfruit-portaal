import type { Meta, StoryObj } from '@storybook/react';
import PasswordInput from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/Password input',
  component: PasswordInput,
};

export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
    label: 'Wachtwoord',
  },
};

export const WithError: Story = {
  args: {
    label: 'Wachtwoord',
    error: 'Het wachtwoord mag niet leeg zijn',
  },
};
