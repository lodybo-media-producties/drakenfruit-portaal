import type { Meta, StoryObj } from '@storybook/react';
import ListSelector, { type ListItem } from './ListSelector';

export default {
  title: 'Components/List selector',
  component: ListSelector,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ListSelector>;

type Story = StoryObj<typeof ListSelector>;

const items: ListItem[] = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
  { id: '4', label: 'Item 4' },
];

export const SingleSelection: Story = {
  args: {
    labels: {
      title: 'Items',
      addButtonLabel: 'Choose items',
      noItemsLabel: 'No items selected',
      dialogTitle: 'Select items',
      dialogDescription: 'Select items to add to the list',
    },
    items,
  },
};

export const MultipleSelection: Story = {
  args: {
    labels: {
      title: 'Items',
      addButtonLabel: 'Choose items',
      noItemsLabel: 'No items selected',
      dialogTitle: 'Select items',
      dialogDescription: 'Select items to add to the list',
    },
    items,
    multiple: true,
  },
};

export const WithInitialSingleSelection: Story = {
  args: {
    labels: {
      title: 'Items',
      addButtonLabel: 'Choose items',
      noItemsLabel: 'No items selected',
      dialogTitle: 'Select items',
      dialogDescription: 'Select items to add to the list',
    },
    items,
    selectedId: '2',
  },
};

export const WithInitialMultipleSelection: Story = {
  args: {
    labels: {
      title: 'Items',
      addButtonLabel: 'Choose items',
      noItemsLabel: 'No items selected',
      dialogTitle: 'Select items',
      dialogDescription: 'Select items to add to the list',
    },
    multiple: true,
    items,
    selectedIds: ['2', '4'],
  },
};

export const WithError: Story = {
  args: {
    labels: {
      title: 'Items',
      addButtonLabel: 'Choose items',
      noItemsLabel: 'No items selected',
      dialogTitle: 'Select items',
      dialogDescription: 'Select items to add to the list',
    },
    items,
    error: 'Selection is required',
  },
};
