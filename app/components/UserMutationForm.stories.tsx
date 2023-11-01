import type { Meta, StoryObj } from '@storybook/react';
import UserMutationForm from './UserMutationForm';
import { faker } from '@faker-js/faker';

export default {
  title: 'Forms/User',
  component: UserMutationForm,
  decorators: [
    (Story) => (
      <div className="w-[75vw]">
        <Story />
        </div>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof UserMutationForm>;

type Story = StoryObj<typeof UserMutationForm>;

const organisations = [...Array(10)].map((_, i) => ({
  id: `${i + 2}`,
  name: faker.company.name(),
}));

const projects = [...Array(10)].map((_, i) => ({
  id: `${i + 2}`,
  name: faker.commerce.productName(),
}));

export const Default: Story = {
  args: {
    mode: 'create',
    backLink: '/admin/users',
    backLinkLabel: 'Back to users',
    organisations,
    projects,
  },
};
