import type { Meta, StoryObj } from '@storybook/react';
import PaymentForm from 'app/components/PaymentForm';
import { issuers } from 'test/issuers';

export default {
  title: 'Forms/Payment Form',
  component: PaymentForm,
} satisfies Meta<typeof PaymentForm>;

type Story = StoryObj<typeof PaymentForm>;

export const Default: Story = {
  args: {
    issuers,
    price: 8.99,
  },
  // @ts-ignore
  remixStub: {
    initialEntries: ['/'],
    routes: [
      {
        path: '/',
      },
      {
        path: '/api/payments',
        action: async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return { ok: true };
        },
      },
    ],
  },
};

export const WithIssuerError: Story = {
  args: {
    issuers,
    price: 8.99,
  },
};
