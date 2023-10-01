import { type Meta, type StoryObj } from '@storybook/react';
import Editor from '~/components/Editor';

const meta: Meta = {
  title: 'Components / Editor',
  component: Editor,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Editor>;

export const Default: Story = {
  args: {
    initialValue: 'Hello world',
  },
};
