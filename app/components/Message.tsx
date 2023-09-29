import * as React from 'react';
import { cn } from '~/lib/utils';

type Props = {
  id?: string;
  variant: 'info' | 'error';
  message: string | undefined;
  subtle?: boolean;
};

export default function Message({ variant, message, id, subtle }: Props) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn('pt-1', {
        'bg-light-blue border border-dark-blue rounded-md p-2':
          !subtle && variant === 'info',
        'text-dark-blue border-none': subtle && variant === 'info',

        'bg-light-pink border border-dark-pink rounded-md p-2':
          !subtle && variant === 'error',
        'text-dark-pink': subtle && variant === 'error',
      })}
      id={id}
    >
      {message}
    </div>
  );
}
