import type { Meta, StoryObj } from '@storybook/react';
import Select, { type SelectOption } from './Select';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Select',
  component: Select,
} satisfies Meta<typeof Select>;

type Story = StoryObj<typeof Select>;

const options: SelectOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: `value-${i}`,
  label: faker.music.genre(),
}));

export const Default: Story = {
  args: {
    placeholder: 'Select an option',
    options,
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Select an option',
    options,
    initialValue: options[4].value,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Select an option',
    options,
    error: 'This is an error',
  },
};
