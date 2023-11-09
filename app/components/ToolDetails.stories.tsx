import type { Meta, StoryObj } from '@storybook/react';
import ToolDetails from './ToolDetails';
import { type ToolWithCategories } from '~/models/tools.server';
import { faker } from '@faker-js/faker';

export default {
  title: 'Overviews/Tool Details Overview',
  component: ToolDetails,
} satisfies Meta<typeof ToolDetails>;

type Story = StoryObj<typeof ToolDetails>;

const tool: ToolWithCategories = {
  id: faker.string.uuid(),
  name: {
    nl: faker.lorem.sentence(),
    en: faker.lorem.sentence(),
  },
  summary: {
    nl: faker.lorem.paragraph(),
    en: faker.lorem.paragraph(),
  },
  description: {
    nl: faker.lorem.paragraphs(),
    en: faker.lorem.paragraphs(),
  },
  filename: faker.system.fileName(),
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
    },
  ],
};

const BackLink = () => <a href="#">Terug naar overzicht</a>;

export const Default: Story = {
  args: {
    tool,
  },
};

// Turned off because of an error in Storybook
// export const WithCustomBackLink: Story = {
//   args: {
//     tool,
//     backLink: <BackLink />,
//   },
// };
