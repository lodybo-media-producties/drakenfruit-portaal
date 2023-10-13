import type { Meta, StoryObj } from '@storybook/react';
import OrganisationSelector from './OrganisationSelector';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Organisation selector',
  component: OrganisationSelector,
} satisfies Meta<typeof OrganisationSelector>;

type Story = StoryObj<typeof OrganisationSelector>;

export const Default: Story = {
  args: {
    organisations: [
      {
        id: '1',
        name: 'Drakenfruit',
      },
      ...Array(10),
    ].map((_, i) => ({
      id: `${i + 2}`,
      name: faker.company.name(),
    })),
  },
};
