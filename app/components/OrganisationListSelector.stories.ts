import type { Meta, StoryObj } from '@storybook/react';
import OrganisationListSelector, {
  type OrganisationSelection,
} from './OrganisationListSelector';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Organisation List selector',
  component: OrganisationListSelector,
} satisfies Meta<typeof OrganisationListSelector>;

type Story = StoryObj<typeof OrganisationListSelector>;

const organisations: OrganisationSelection[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `${i + 1}`,
    name: faker.company.name(),
  })
);

export const Default: Story = {
  args: {
    organisations,
  },
};

export const WithSelected: Story = {
  args: {
    organisations,
    selectedId: '2',
  },
};

export const WithMultipleSelected: Story = {
  args: {
    organisations,
    multiple: true,
    selectedIds: ['2', '3'],
  },
};

export const WithError: Story = {
  args: {
    organisations,
    error: 'Something went wrong',
  },
};
