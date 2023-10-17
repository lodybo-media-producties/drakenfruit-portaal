import type { Meta, StoryObj } from '@storybook/react';
import ProjectListSelector, { type ListItem } from './ProjectListSelector';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Project List selector',
  component: ProjectListSelector,
} satisfies Meta<typeof ProjectListSelector>;

type Story = StoryObj<typeof ProjectListSelector>;

const items: ListItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  label: faker.commerce.productName(),
}));

export const Default: Story = {
  args: {
    items,
  },
};

export const WithSelected: Story = {
  args: {
    items,
    selectedId: '2',
  },
};

export const WithMultipleSelected: Story = {
  args: {
    items,
    multiple: true,
    selectedIds: ['2', '3'],
  },
};

export const WithError: Story = {
  args: {
    items,
    error: 'Something went wrong',
  },
};
