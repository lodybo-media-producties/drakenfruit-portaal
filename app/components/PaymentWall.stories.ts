import type { Meta, StoryObj } from '@storybook/react';
import PaymentWall from './PaymentWall';
import { issuers } from 'test/issuers';

export default {
  title: 'Components/Payment Wall',
  component: PaymentWall,
} satisfies Meta<typeof PaymentWall>;

type Story = StoryObj<typeof PaymentWall>;

export const Default: Story = {
  args: {
    title: 'Lorem Ipsum',
    description: 'Dolor sit amet',
    image: 'https://via.placeholder.com/150',
    purchasePrice: 10,
    issuers,
  },
};
