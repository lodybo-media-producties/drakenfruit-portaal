import type { Meta, StoryObj } from '@storybook/react';
import Toggle from './Toggle';

export default {
  title: 'Components/Toggle',
  component: Toggle,
} satisfies Meta<typeof Toggle>;

type Story = StoryObj<typeof Toggle>;

export const TwoOptions: Story = {
  name: 'Two options',
  args: {
    options: [
      { label: 'Ja', value: 'yes' },
      { label: 'Nee', value: 'no' },
    ],
  },
};

export const ThreeOptions: Story = {
  name: 'Three options',
  args: {
    options: [
      { label: 'Ja', value: 'yes' },
      { label: 'Misschien', value: 'maybe' },
      { label: 'Nee', value: 'no' },
    ],
  },
};

export const WithNotificationCount: Story = {
  name: 'With notification count',
  args: {
    options: [
      { label: 'Ja', value: 'yes' },
      { label: 'Nee', value: 'no', notificationCount: 2 },
    ],
  },
};
