import type { Meta, StoryObj } from '@storybook/react';
import ContentMeta from './ContentMeta';

export default {
  title: 'Components/Content Meta',
  component: ContentMeta,
} satisfies Meta<typeof ContentMeta>;

type Story = StoryObj<typeof ContentMeta>;

const author: Pick<Parameters<typeof ContentMeta>[0], 'author'>['author'] = {
  id: '1',
  firstName: 'Kaylee',
  lastName: 'Rosalina',
};

const categories: Pick<
  Parameters<typeof ContentMeta>[0],
  'categories'
>['categories'] = [
  {
    id: '1',
    name: {
      nl: 'Diversiteit',
      en: 'Diversity',
    },
    slug: {
      nl: '/categories/diversiteit',
      en: '/categories/diversity',
    },
  },
];

export const NotUpdatedMeta: Story = {
  name: 'Not updated content',
  args: {
    author,
    categories,
    createdAt: '01 Jan 2021 11:00',
    updatedAt: '01 Jan 2021 11:00',
  },
};

export const UpdatedMeta: Story = {
  name: 'Updated content',
  args: {
    author,
    categories,
    createdAt: '01 Jan 2021 11:00',
    updatedAt: '02 Jan 2021 14:45',
  },
};
