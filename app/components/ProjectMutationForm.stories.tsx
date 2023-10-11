import type { Meta, StoryObj } from '@storybook/react';
import ProjectMutationForm from './ProjectMutationForm';
import { faker } from '@faker-js/faker';

export default {
  title: 'Forms/Projects',
  component: ProjectMutationForm,
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
} satisfies Meta<typeof ProjectMutationForm>;

type Story = StoryObj<typeof ProjectMutationForm>;

const organisations = [...Array(10)].map((_, i) => ({
  id: `${i + 2}`,
  name: faker.company.name(),
}));

export const NewProject: Story = {
  args: {
    mode: 'create',
    organisations,
    backLink: '/admin/projects',
    backLinkLabel: 'Back to projects',
  },
};

export const EditProject: Story = {
  args: {
    mode: 'update',
    organisations,
    backLink: '/admin/projects',
    backLinkLabel: 'Back to projects',
    initialValues: {
      name: 'Inclusiviteitsprogramma opzetten',
      description: 'Inclusiviteitsprogramma opzetten voor Drakenfruit.',
      organisationId: '5',
    },
  },
};

export const EditProjectWithErrors: Story = {
  args: {
    mode: 'update',
    organisations,
    backLink: '/admin/projects',
    backLinkLabel: 'Back to projects',
    initialValues: {
      name: 'Inclusiviteitsprogramma opzetten',
      description: 'Inclusiviteitsprogramma opzetten voor Drakenfruit.',
      organisationId: '3',
    },
    errors: {
      name: 'Name is required',
      description: 'Description is required',
      organisationId: 'Organisation is required',
    },
  },
};
