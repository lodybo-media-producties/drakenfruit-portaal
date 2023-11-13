import type { Meta, StoryObj } from '@storybook/react';
import MainMenu from './MainMenu';

export default {
  title: 'Components/Main menu',
  component: MainMenu,
} satisfies Meta<typeof MainMenu>;

type Story = StoryObj<typeof MainMenu>;

export const LoggedOutUser: Story = {
  args: {},
};

export const LoggedInUser: Story = {
  args: {
    user: {
      id: '1',
      firstName: 'Kaylee',
      lastName: 'Rosalina',
      email: 'kaylee@drakenfruit.com',
      role: 'ADMIN',
      locale: 'NL',
      organisationId: '1',
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};
