import type { Meta, StoryObj } from '@storybook/react';
import FileInput from '~/components/FileInput';

export default {
  title: 'Components/File input',
  component: FileInput,
} satisfies Meta<typeof FileInput>;

type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  args: {},
};

export const ImageInput: Story = {
  args: {
    accept: 'image/*',
  },
};

export const WithError: Story = {
  args: {
    error: 'This is an error',
  },
};
