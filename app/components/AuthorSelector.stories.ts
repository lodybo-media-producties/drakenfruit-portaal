import type { Meta, StoryObj } from '@storybook/react';
import AuthorSelector, { type Author } from './AuthorSelector';

export default {
  title: 'Components/Author selector',
  component: AuthorSelector,
  args: {
    onSelect: (author) =>
      console.log(
        `Selected author ${authors.find((a) => a.id === author)?.firstName}`
      ),
  },
  argTypes: {
    onSelect: { action: 'selected' },
  },
} satisfies Meta<typeof AuthorSelector>;

type Story = StoryObj<typeof AuthorSelector>;

const authors: Author[] = [
  { id: '1', firstName: 'Kaylee', lastName: 'Rosalina' },
  { id: '2', firstName: 'Lody', lastName: 'Borgers' },
  { id: '3', firstName: 'Simone', lastName: 'Leenders' },
];

export const Default: Story = {
  args: {
    authors,
  },
};

export const WithSelectedAuthor: Story = {
  args: {
    authors,
    initialSelectedAuthorID: '2',
  },
};

export const WithErrorMessage: Story = {
  args: {
    authors,
    error: 'Select an author please',
  },
};
