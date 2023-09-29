import type { Meta, StoryObj } from '@storybook/react';
import CategoryInput from './CategoryInput';

export default {
  title: 'Components/Category input',
  component: CategoryInput,
} satisfies Meta<typeof CategoryInput>;

type Story = StoryObj<typeof CategoryInput>;

export const Default: Story = {
  args: {

  },
};
