import type { Meta, StoryObj } from '@storybook/react';
import Prose from './Prose';
import { faker } from '@faker-js/faker';

export default {
  title: 'Components/Prose',
  component: Prose,
} satisfies Meta<typeof Prose>;

type Story = StoryObj<typeof Prose>;

const getText = () => (
  <>
    <h1>{faker.lorem.sentence()}</h1>
    <p>{faker.lorem.paragraphs(3)}</p>

    <h2>{faker.lorem.sentence()}</h2>
    <p>{faker.lorem.paragraphs(3)}</p>
    <p>{faker.lorem.paragraphs(4)}</p>
  </>
);

export const Default: Story = {
  args: {
    children: getText(),
  },
};
