import type { Meta, StoryObj } from '@storybook/react';
import PaymentWall from './PaymentWall';
import { type Issuer } from '~/payments.server';

const issuers: Issuer[] = [
  {
    id: 'ideal_ABNANL2A',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/ABNANL2A.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/ABNANL2A%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/ABNANL2A.svg',
    },
    name: 'ABN AMRO',
    resource: 'issuer',
  },
  {
    id: 'ideal_INGBNL2A',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/INGBNL2A.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/INGBNL2A%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/INGBNL2A.svg',
    },
    name: 'ING',
    resource: 'issuer',
  },
  {
    id: 'ideal_RABONL2U',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/RABONL2U.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/RABONL2U%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/RABONL2U.svg',
    },
    name: 'Rabobank',
    resource: 'issuer',
  },
  {
    id: 'ideal_ASNBNL21',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/ASNBNL21.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/ASNBNL21%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/ASNBNL21.svg',
    },
    name: 'ASN Bank',
    resource: 'issuer',
  },
  {
    id: 'ideal_BUNQNL2A',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/BUNQNL2A.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/BUNQNL2A%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/BUNQNL2A.svg',
    },
    name: 'bunq',
    resource: 'issuer',
  },
  {
    id: 'ideal_KNABNL2H',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/KNABNL2H.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/KNABNL2H%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/KNABNL2H.svg',
    },
    name: 'Knab',
    resource: 'issuer',
  },
  {
    id: 'ideal_NTSBDEB1',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/NTSBDEB1.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/NTSBDEB1%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/NTSBDEB1.svg',
    },
    name: 'N26',
    resource: 'issuer',
  },
  {
    id: 'ideal_NNBANL2G',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/NNBANL2G.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/NNBANL2G%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/NNBANL2G.svg',
    },
    name: 'NN',
    resource: 'issuer',
  },
  {
    id: 'ideal_RBRBNL21',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/RBRBNL21.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/RBRBNL21%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/RBRBNL21.svg',
    },
    name: 'Regiobank',
    resource: 'issuer',
  },
  {
    id: 'ideal_REVOLT21',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/REVOLT21.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/REVOLT21%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/REVOLT21.svg',
    },
    name: 'Revolut',
    resource: 'issuer',
  },
  {
    id: 'ideal_SNSBNL2A',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/SNSBNL2A.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/SNSBNL2A%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/SNSBNL2A.svg',
    },
    name: 'SNS Bank',
    resource: 'issuer',
  },
  {
    id: 'ideal_TRIONL2U',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/TRIONL2U.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/TRIONL2U%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/TRIONL2U.svg',
    },
    name: 'Triodos',
    resource: 'issuer',
  },
  {
    id: 'ideal_FVLBNL22',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/FVLBNL22.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/FVLBNL22%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/FVLBNL22.svg',
    },
    name: 'Van Lanschot Kempen',
    resource: 'issuer',
  },
  {
    id: 'ideal_BITSNL2A',
    image: {
      size1x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/BITSNL2A.png',
      size2x:
        'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/BITSNL2A%402x.png',
      svg: 'https://www.mollie.com/external/icons/payment-methods/ideal/issuers/BITSNL2A.svg',
    },
    name: 'Yoursafe',
    resource: 'issuer',
  },
];

export default {
  title: 'Forms/Payment Wall',
  component: PaymentWall,
} satisfies Meta<typeof PaymentWall>;

type Story = StoryObj<typeof PaymentWall>;

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
