import type { Meta, StoryObj } from '@storybook/react';
import ProjectListSelector, {
  type ProjectSelection,
} from './ProjectListSelector';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Project List selector',
  component: ProjectListSelector,
} satisfies Meta<typeof ProjectListSelector>;

type Story = StoryObj<typeof ProjectListSelector>;

const projects: ProjectSelection[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  name: faker.commerce.productName(),
}));

export const Default: Story = {
  args: {
    projects,
  },
};

export const WithSelected: Story = {
  args: {
    projects,
    selectedId: '2',
  },
};

export const WithMultipleSelected: Story = {
  args: {
    projects,
    multiple: true,
    selectedIds: ['2', '3'],
  },
};

export const WithError: Story = {
  args: {
    projects,
    error: 'Something went wrong',
  },
};
