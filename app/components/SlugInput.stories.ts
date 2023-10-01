import type { Meta, StoryObj } from '@storybook/react';
import SlugInput from './SlugInput';

export default {
  title: 'Components/Slug input',
  component: SlugInput,
} satisfies Meta<typeof SlugInput>;

type Story = StoryObj<typeof SlugInput>;

export const Default: Story = {
  args: {
    label: 'Slug',
    defaultValue: 'a-slug-for-a-title-here',
  },
};

export const WithError: Story = {
  args: {
    label: 'Slug',
    defaultValue: 'this would not work',
    error: 'Please enter a valid slug',
  },
};
