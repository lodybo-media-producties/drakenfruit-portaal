import type { Meta, StoryObj } from '@storybook/react';
import ItemCard from 'app/components/ItemCard';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Item Card',
  component: ItemCard,
} satisfies Meta<typeof ItemCard>;

type Story = StoryObj<typeof ItemCard>;

export const Article: Story = {
  args: {
    item: {
      type: 'article',
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
      updatedAt: faker.date.past().toString(),
    },
  },
};

export const Tool: Story = {
  args: {
    item: {
      type: 'tool',
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
      image: faker.image.urlLoremFlickr({ category: 'ui' }),
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
      updatedAt: faker.date.past().toISOString(),
    },
  },
};
