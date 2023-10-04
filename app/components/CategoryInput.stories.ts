import type { Meta, StoryObj } from '@storybook/react';
import CategoryInput, { type CategorySelection } from './CategoryInput';
import { type CategoryErrors } from '~/types/Validations';

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
  title: 'Components/Category input',
  component: CategoryInput,
  args: {
    // @ts-ignore
    remixStub: {
      initialEntries: ['/'],
      routes: [
        {
          path: '/',
        },
        {
          path: '/api/categories',
          action: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return { ok: true };
          },
        },
      ],
    },
  },
} satisfies Meta<typeof CategoryInput>;

type Story = StoryObj<typeof CategoryInput>;

export const Default: Story = {
  args: {
    categories,
  },
};

export const WithSingleCategorySelected: Story = {
  args: {
    categories,
    initialCategories: ['2'],
  },
};

export const WithMultipleCategoriesSelected: Story = {
  args: {
    categories,
    initialCategories: ['1', '3'],
  },
};

export const WithError: Story = {
  args: {
    categories,
    error: 'Something went wrong',
  },
};

export const WithCustomCategoryError: Story = {
  args: {
    categories,
    // @ts-ignore
    remixStub: {
      initialEntries: ['/'],
      routes: [
        {
          path: '/',
        },
        {
          path: '/api/categories',
          action: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const errors: CategoryErrors = {
              name: {
                nl: 'Dit is een fout',
              },
              description: {
                en: 'This is an error',
                nl: 'Dit is een fout',
              },
            };
            return errors;
          },
        },
      ],
    },
  },
};
