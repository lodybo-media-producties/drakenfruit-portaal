import type { Meta, StoryObj } from '@storybook/react';
import CategoryMutationForm from './CategoryMutationForm';

export default {
  title: 'Forms/Category',
  component: CategoryMutationForm,
  decorators: [
    (Story) => (
      <div className="w-[75vw]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CategoryMutationForm>;

type Story = StoryObj<typeof CategoryMutationForm>;

export const Default: Story = {
  args: {
    mode: 'create',
    backLink: '',
    backLinkLabel: 'Back to categories',
  },
};
