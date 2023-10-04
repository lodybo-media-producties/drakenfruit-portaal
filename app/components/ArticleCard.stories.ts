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
      content: {
        nl: faker.lorem.paragraphs(3),
        en: faker.lorem.paragraphs(3),
      },
      slug: {
        nl: faker.lorem.slug(),
        en: faker.lorem.slug(),
      },
      published: true,
      image: 'https://source.unsplash.com/LQ1t-8Ms5PY',
      author: {
        id: faker.string.uuid(),
        firstName: 'Kaylee',
        lastName: 'Rosalina',
      },
      authorId: faker.string.uuid(),
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
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    },
  },
};
