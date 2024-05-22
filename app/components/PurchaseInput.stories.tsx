import type { Meta, StoryObj } from '@storybook/react';
import PurchaseInput from './PurchaseInput';

export default {
  title: 'Components/Purchase Input',
  component: PurchaseInput,
  decorators: [
    (Story) => (
      <div style={{ width: '100px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PurchaseInput>;

type Story = StoryObj<typeof PurchaseInput>;

export const Default: Story = {
  args: {
    onChange: (values) => console.log(values),
  },
};

export const WithInitialValues: Story = {
  args: {
    initialValues: {
      purchasable: true,
      purchasePrice: 8.99,
    },
    onChange: (values) => console.log(values),
  },
};

export const WithError: Story = {
  args: {
    error: 'This is an error message',
    onChange: (values) => console.log(values),
  },
};
