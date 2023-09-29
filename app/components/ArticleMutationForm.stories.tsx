import { type Meta, type StoryObj } from '@storybook/react';
import ArticleMutationForm from '~/components/ArticleMutationForm';
import { type Author } from '~/components/AuthorSelector';

const authors: Author[] = [
  { id: '1', firstName: 'Kaylee', lastName: 'Rosalina' },
  { id: '2', firstName: 'Lody', lastName: 'Borgers' },
  { id: '3', firstName: 'Simone', lastName: 'Leenders' },
];

export default {
  title: 'Forms/Article',
  component: ArticleMutationForm,
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
} satisfies Meta<typeof ArticleMutationForm>;

type Story = StoryObj<typeof ArticleMutationForm>;

export const New: Story = {
  name: 'New Article',
  args: {
    mode: 'create',
    authors,
  },
};
