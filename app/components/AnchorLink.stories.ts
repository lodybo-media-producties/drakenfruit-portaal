import type { Meta, StoryObj } from '@storybook/react';
import AnchorLink from './AnchorLink';

export default {
  title: 'Components/Anchor',
  component: AnchorLink,
} satisfies Meta<typeof AnchorLink>;

type Story = StoryObj<typeof AnchorLink>;

export const Default: Story = {
  args: {
    to: '#',
    children: 'Go to page',
  },
};
