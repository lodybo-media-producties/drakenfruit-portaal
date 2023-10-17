import type { Meta, StoryObj } from '@storybook/react';
import UserListSelector, { type ListItem } from './UserListSelector';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/User List selector',
  component: UserListSelector,
} satisfies Meta<typeof UserListSelector>;

type Story = StoryObj<typeof UserListSelector>;

const items: ListItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  label: faker.person.fullName(),
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
