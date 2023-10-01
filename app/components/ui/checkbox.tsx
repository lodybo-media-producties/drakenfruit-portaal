import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '~/lib/utils';
import Icon from '~/components/Icon';
import { inputClasses } from './input';

export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      `peer
       h-6 w-6
       shrink-0
     
       rounded-sm
       border
       disabled:border-neutral-300
       border-neutral-900
     
       ${inputClasses.focusAndFocusVisible}
       
       cursor-pointer
       disabled:cursor-not-allowed
       disabled:opacity-50
       
       data-[state=checked]:bg-dark-blue
       data-[state=checked]:text-neutral-50
       dark:data-[state=checked]:bg-neutral-50
       dark:data-[state=checked]:text-neutral-900
       
       dark:border-neutral-800
       dark:disabled:border-neutral-50
       dark:ring-offset-neutral-950
       dark:focus-visible:ring-neutral-300
       
       transition
     `,
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Icon name="check" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
