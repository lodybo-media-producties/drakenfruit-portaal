import type { Meta, StoryObj } from '@storybook/react';
import BookmarkIndicator from 'app/components/BookmarkIndicator';

export default {
  title: 'Components/Bookmark Indicator',
  component: BookmarkIndicator,
} satisfies Meta<typeof BookmarkIndicator>;

type Story = StoryObj<typeof BookmarkIndicator>;

export const NotBookmarked: Story = {
  args: {
    bookmarked: false,
    bookmarkID: '1',
  },
};

export const Bookmarked: Story = {
  args: {
    bookmarked: true,
    bookmarkID: '1',
  },
};
