import type { Meta, StoryObj } from '@storybook/react';
import ArticleDetails from './ArticleDetails';
import { type convertPrismaArticleToLocalisedArticle } from '~/utils/content';
import { faker } from '@faker-js/faker/locale/nl';
import { SerializeFrom } from '@remix-run/node';

export default {
  title: 'Overviews/Article Details',
  component: ArticleDetails,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ArticleDetails>;

type Story = StoryObj<typeof ArticleDetails>;

const content = `
  <p>{ faker.lorem.paragraph() }</p>
  <p>{ faker.lorem.paragraph() }</p>
  <p>{ faker.lorem.paragraph() }</p>
`;

const article: SerializeFrom<
  ReturnType<typeof convertPrismaArticleToLocalisedArticle>
> = {
  id: '1',
  title: faker.lorem.sentence(),
  content,
  summary: faker.lorem.paragraph(),
  categories: [
    {
      id: '1',
      name: faker.lorem.word(),
      slug: faker.lorem.slug(),
    },
  ],
  slug: faker.lorem.slug(),
  published: true,
  image: faker.image.urlLoremFlickr(),
  author: {
    id: '1',
    firstName: 'Kaylee',
    lastName: 'Rosalina',
    avatarUrl: faker.image.avatar(),
  },
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.past().toISOString(),
};

export const Default: Story = {
  args: {
    article,
  },
};
