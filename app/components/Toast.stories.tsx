import type { Meta, StoryObj } from '@storybook/react';
import Button from '~/components/Button';
import { useToast } from '~/components/ui/use-toast';
import { Toaster } from '~/components/ui/toaster';
import { type ToastProps } from '~/components/ui/toast';

type Props = ToastProps & {
  description: string;
  destructive?: boolean;
};

const Notification = ({ title, description, destructive }: Props) => {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title,
          description,
          variant: destructive ? 'destructive' : 'default',
        });
      }}
    >
      Show notification
    </Button>
  );
};

export default {
  title: 'Components/Toast',
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Notification>;

type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  render: () => (
    <Notification
      title="Article added"
      description="A new article has been added to the list"
    />
  ),
};

export const Destructive: Story = {
  render: () => (
    <Notification
      title="Article deleted"
      description="The article has been deleted"
      destructive
    />
  ),
};
