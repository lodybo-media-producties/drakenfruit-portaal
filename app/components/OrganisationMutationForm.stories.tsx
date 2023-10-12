import type { Meta, StoryObj } from '@storybook/react';
import OrganisationMutationForm from './OrganisationMutationForm';

export default {
  title: 'Forms/Organisations',
  component: OrganisationMutationForm,
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
} satisfies Meta<typeof OrganisationMutationForm>;

type Story = StoryObj<typeof OrganisationMutationForm>;

export const NewOrganisation: Story = {
  args: {
    mode: 'create',
    backLink: '/admin/organisations',
    backLinkLabel: 'Back to organisations',
  },
};

export const EditOrganisation: Story = {
  args: {
    mode: 'update',
    backLink: '/admin/organisations',
    backLinkLabel: 'Back to organisations',
    initialValues: {
      name: 'Drakenfruit',
      description: 'Drakenfruit is een inclusieve community.',
    },
  },
};

export const EditOrganisationWithErrors: Story = {
  args: {
    mode: 'update',
    backLink: '/admin/organisations',
    backLinkLabel: 'Back to organisations',
    initialValues: {
      name: 'Drakenfruit',
      description: 'Drakenfruit is een inclusieve community.',
    },
    errors: {
      name: 'Name is required',
      description: 'Description is required',
    },
  },
};
