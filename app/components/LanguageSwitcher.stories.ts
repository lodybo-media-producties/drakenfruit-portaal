import type { Meta, StoryObj } from '@storybook/react';
import LanguageSwitcher from './LanguageSwitcher';

export default {
  title: 'Components/Language Switcher',
  component: LanguageSwitcher,
} satisfies Meta<typeof LanguageSwitcher>;

type Story = StoryObj<typeof LanguageSwitcher>;

export const Small: Story = {
  args: {
    mode: 'small',
  },
};

export const Large: Story = {
  args: {
    mode: 'large',
  },
};
