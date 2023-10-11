import type { Meta, StoryObj } from '@storybook/react';
import DeleteItemDialog from '~/components/DeleteItemDialog';

export default {
  title: 'Components/Delete Item Dialog',
  component: DeleteItemDialog,
} satisfies Meta<typeof DeleteItemDialog>;

type Story = StoryObj<typeof DeleteItemDialog>;

export const Default: Story = {
  args: {
    deletionEndpoint: '/api/articles',
    itemToDelete: {
      id: '1',
      name: 'Article 1',
    },
    // @ts-ignore
    remixStub: {
      initialEntries: ['/'],
      routes: [
        {
          path: '/',
        },
        {
          path: '/api/articles',
          action: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return { ok: true };
          },
        },
      ],
    },
  },
};

export const FailedRequest: Story = {
  args: {
    deletionEndpoint: '/api/articles',
    itemToDelete: {
      id: '1',
      name: 'Article 1',
    },
    // @ts-ignore
    remixStub: {
      initialEntries: ['/'],
      routes: [
        {
          path: '/',
        },
        {
          path: '/api/articles',
          action: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return { ok: false, message: 'Something went wrong' };
          },
        },
      ],
    },
  },
};

export const CustomMessage: Story = {
  args: {
    deletionEndpoint: '/api/articles',
    itemToDelete: {
      id: '1',
      name: 'Article 1',
    },
    additionalMessage: '[ ==> Add your custom message key here]',
    // @ts-ignore
    remixStub: {
      initialEntries: ['/'],
      routes: [
        {
          path: '/',
        },
        {
          path: '/api/articles',
          action: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return { ok: true };
          },
        },
      ],
    },
  },
};

export const CustomMessageWithHTML: Story = {
  args: {
    deletionEndpoint: '/api/articles',
    itemToDelete: {
      id: '1',
      name: 'Article 1',
    },
    additionalMessage:
      '[ ==> Add your <strong>custom message</strong> key here]',
    // @ts-ignore
    remixStub: {
      initialEntries: ['/'],
      routes: [
        {
          path: '/',
        },
        {
          path: '/api/articles',
          action: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return { ok: true };
          },
        },
      ],
    },
  },
};
