import type { Meta, StoryObj } from '@storybook/react';
import ArticleCard from './ArticleCard';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Article Card',
  component: ArticleCard,
} satisfies Meta<typeof ArticleCard>;

type Story = StoryObj<typeof ArticleCard>;

export const Default: Story = {
  args: {
    article: {
      id: faker.string.uuid(),
      title: {
        nl: faker.lorem.sentence(),
        en: faker.lorem.sentence(),
      },
      summary: {
        nl: faker.lorem.paragraph(),
        en: faker.lorem.paragraph(),
      },
      slug: {
        nl: faker.lorem.slug(),
        en: faker.lorem.slug(),
      },
      image: 'https://source.unsplash.com/LQ1t-8Ms5PY',
      author: {
        id: faker.string.uuid(),
        firstName: 'Kaylee',
        lastName: 'Rosalina',
      },
      categories: [
        {
          id: faker.string.uuid(),
          name: {
            nl: 'Diversiteit',
            en: 'Diversity',
          },
          slug: {
            nl: 'diversiteit',
            en: 'diversity',
          },
        },
      ],
      createdAt: faker.date.past().toString(),
      updatedAt: faker.date.past().toString(),
    },
  },
};
