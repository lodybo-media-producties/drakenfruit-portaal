import { type Meta, type StoryObj } from '@storybook/react';
import ArticleMutationForm from '~/components/ArticleMutationForm';
import { type Author } from '~/components/AuthorSelector';
import { type CategorySelection } from '~/components/CategoryInput';

const authors: Author[] = [
  { id: '1', firstName: 'Kaylee', lastName: 'Rosalina' },
  { id: '2', firstName: 'Lody', lastName: 'Borgers' },
  { id: '3', firstName: 'Simone', lastName: 'Leenders' },
];

const categories: CategorySelection[] = [
  {
    id: '1',
    name: {
      nl: 'Inclusie',
      en: 'Inclusion',
    },
  },
  {
    id: '2',
    name: {
      nl: 'Diversiteit',
      en: 'Diversity',
    },
  },
  {
    id: '3',
    name: {
      nl: 'Projectmanagement',
      en: 'Project management',
    },
  },
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
    categories,
    backLink: '/admin/articles',
    backLinkLabel: 'Back to articles',
  },
};

export const Edit: Story = {
  name: 'Edit Article',
  args: {
    mode: 'update',
    authors,
    categories,
    backLink: '/admin/articles',
    backLinkLabel: 'Back to articles',
    initialValues: {
      id: '1',
      authorId: '1',
      published: true,
      title: {
        nl: 'Een nieuwe blogpost',
        en: 'A new blog post',
      },
      summary: {
        nl: 'Dit is de samenvatting',
        en: 'This is the summary',
      },
      content: {
        nl: 'Dit is de content',
        en: 'This is the content',
      },
      categories: ['2'],
      slug: {
        nl: 'een-nieuwe-blogpost',
        en: 'a-new-blog-post',
      },
      image: '/image/trouw2.jpg',
    },
  },
};
