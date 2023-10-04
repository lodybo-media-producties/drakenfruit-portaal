import type { Meta, StoryObj } from '@storybook/react';
import UploadProgressBar from './UploadProgressBar';

export default {
  title: 'Components/Upload Progress Bar',
  component: UploadProgressBar,
  decorators: [
    (Story) => (
      <div className="w-[75vw]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UploadProgressBar>;

type Story = StoryObj<typeof UploadProgressBar>;

export const Simple: Story = {
  args: {
    progress: 50,
  },
};

export const WithSubLabels: Story = {
  args: {
    progress: 50,
    subLabels: ['Uploading file...', '50%'],
  },
};
