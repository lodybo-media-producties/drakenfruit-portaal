import type { Meta, StoryObj } from '@storybook/react';
import UserListSelector, { type UserSelection } from './UserListSelector';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/User List selector',
  component: UserListSelector,
} satisfies Meta<typeof UserListSelector>;

type Story = StoryObj<typeof UserListSelector>;

const users: UserSelection[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const Default: Story = {
  args: {
    users,
  },
};

export const WithSelected: Story = {
  args: {
    users,
    selectedId: '2',
  },
};

export const WithMultipleSelected: Story = {
  args: {
    users,
    multiple: true,
    selectedIds: ['2', '3'],
  },
};

export const WithError: Story = {
  args: {
    users,
    error: 'Something went wrong',
  },
};
