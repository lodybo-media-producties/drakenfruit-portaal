import * as React from 'react';

import { cn } from '~/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const inputBorderAndBgClasses = `
  border
  border-gray-200
  dark:border-gray-800
  bg-white
  dark:bg-gray-950
  rounded-md
`;

const inputFocusClasses = `
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-offset-2
  focus-visible:ring-gray-400
  dark:focus-visible:ring-gray-800
  ring-offset-white
  dark:ring-offset-gray-950
`;

const inputPlaceholderClasses = `
  placeholder:text-gray-500
  dark:placeholder:text-gray-400
`;

export const inputClasses = {
  borderAndBg: inputBorderAndBgClasses,
  focusAndFocusVisible: inputFocusClasses,
  placeholder: inputPlaceholderClasses,
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `
          flex
          h-10 w-full
          px-3 py-2
          text-sm
          
          ${inputPlaceholderClasses}
          
          ${inputBorderAndBgClasses}
          
          ${inputFocusClasses}
          
          file:font-medium
          file:border-0
          file:bg-transparent
          file:text-sm
          
          disabled:cursor-not-allowed
          disabled:opacity-50
        `,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
