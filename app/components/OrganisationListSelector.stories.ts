import type { Meta, StoryObj } from '@storybook/react';
import OrganisationListSelector, {
  type ListItem,
} from './OrganisationListSelector';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Organisation List selector',
  component: OrganisationListSelector,
} satisfies Meta<typeof OrganisationListSelector>;

type Story = StoryObj<typeof OrganisationListSelector>;

const items: ListItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  label: faker.company.name(),
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
