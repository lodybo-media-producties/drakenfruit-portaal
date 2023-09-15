import type { Meta, StoryObj } from '@storybook/react';
import SearchInput from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Search input',
  component: SearchInput,
  argTypes: {
    onSearch: {
      description: 'The search handler',
      action: 'search',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    searchQuery: '',
    onSearch: (query: string) => console.log(`searching for "${query}"`),
  },
};
