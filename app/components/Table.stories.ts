import { type Meta } from '@storybook/react';
import Table from '~/components/Table';

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Table>;

type Story = Meta<typeof Table>;

export const Default: Story = {
  args: {
    columns: ['Title', 'Summary', 'Author', 'Categories'],
    tableData: [
      {
        id: '1',
        data: new Map([
          ['Title', 'Lorem ipsum'],
          ['Summary', 'Lorem ipsum dolor sit amet'],
          ['Author', 'Kaylee Rosalina'],
          ['Categories', 'Inclusion, Diversity'],
        ]),
      },
    ],
  },
};
