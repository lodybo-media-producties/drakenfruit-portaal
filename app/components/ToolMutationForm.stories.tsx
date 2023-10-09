import type { Meta, StoryObj } from '@storybook/react';
import ToolMutationForm from './ToolMutationForm';
import { type CategorySelection } from '~/components/CategoryInput';

export default {
  title: 'Forms/Tool',
  component: ToolMutationForm,
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
} satisfies Meta<typeof ToolMutationForm>;

type Story = StoryObj<typeof ToolMutationForm>;

const categories: CategorySelection[] = [
  {
    id: '1',
    name: {
      nl: 'Inclusie',
      en: 'Inclusion',
    },
  },
  {
    id: '2',
    name: {
      nl: 'Diversiteit',
      en: 'Diversity',
    },
  },
  {
    id: '3',
    name: {
      nl: 'Projectmanagement',
      en: 'Project management',
    },
  },
];

export const NewTool: Story = {
  args: {
    mode: 'create',
    categories,
    backLink: '/admin/tools',
    backLinkLabel: 'Back to tools',
  },
};

export const EditTool: Story = {
  args: {
    mode: 'update',
    categories,
    backLink: '/admin/tools',
    backLinkLabel: 'Back to tools',
    initialValues: {
      id: '1',
      name: {
        nl: 'Tool 1',
        en: 'Tool 1',
      },
      slug: {
        nl: 'tool-1',
        en: 'tool-1',
      },
      summary: {
        nl: 'Tool 1 summary',
        en: 'Tool 1 summary',
      },
      description: {
        nl: 'Tool 1 description',
        en: 'Tool 1 description',
      },
      filename: '/portal/tools/tool-1.pdf',
      image: '/portal/tools/tool-1.png',
      categories: ['1', '2'],
    },
  },
};
