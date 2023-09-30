import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    primary: false,
  },
};

export const Primary: Story = {
  args: {
    children: 'Button',
    primary: true,
  },
};
export const Inanimated: Story = {
  args: {
    children: 'Button',
    animated: false,
    primary: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
    primary: false,
  },
};
