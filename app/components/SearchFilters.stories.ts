import type { Meta, StoryObj } from '@storybook/react';
import SearchFilters from './SearchFilters';

const meta: Meta<typeof SearchFilters> = {
  title: 'Components/Search Filters',
  component: SearchFilters,
};

export default meta;

type Story = StoryObj<typeof SearchFilters>;

export const Default: Story = {
  args: {
    filters: [
      { slug: 'accessibility', label: 'Accessibility', defaultChecked: true },
      { slug: 'measurements', label: 'Measurements' },
      { slug: 'project-management', label: 'Project Management' },
      { slug: 'tools', label: 'Tools' },
      { slug: 'webinars', label: 'Webinars' },
    ],
  },
};
