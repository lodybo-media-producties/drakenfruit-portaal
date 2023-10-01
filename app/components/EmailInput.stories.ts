import type { Meta, StoryObj } from '@storybook/react';
import EmailInput from './EmailInput';

const meta: Meta<typeof EmailInput> = {
  title: 'Components/Email input',
  component: EmailInput,
};

export default meta;

type Story = StoryObj<typeof EmailInput>;

export const Default: Story = {
  args: {
    label: 'E-mailadres',
  },
};

export const Required: Story = {
  args: {
    label: 'E-mailadres',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'E-mailadres',
    error: 'Dit is geen geldig e-mailadres',
  },
};
