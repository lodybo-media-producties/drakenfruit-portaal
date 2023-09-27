import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from '~/components/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Ik ga akkoord met de algemene voorwaarden',
  },
};

export const Checked: Story = {
  args: {
    ...Default.args,
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const subLabel: Story = {
  args: {
    ...Default.args,
    subLabel: 'Ik heb ze gelezen en ik ga ermee akkoord',
  },
};
