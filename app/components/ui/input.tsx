import * as React from 'react';

import { cn } from '~/lib/utils';
import Message from '~/components/Message';

interface BaseInputProps {
  error?: string;
}

export interface TextInputProps
  extends BaseInputProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export interface TextAreaProps
  extends BaseInputProps,
    React.InputHTMLAttributes<HTMLTextAreaElement> {}

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

const focusWithin = `
  focus-within:outline-none
  focus-within:ring-2
  focus-within:ring-offset-2
  focus-within:ring-gray-400
  dark:focus-within:ring-gray-800
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
  focusWithin,
  placeholder: inputPlaceholderClasses,
};

function getClasses(error: string | undefined, className: string | undefined) {
  return cn(
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
    {
      'border-dark-pink': error,
      'border-2': error,
    },
    className
  );
}

const Input = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, type, ...props }, ref) => {
    const classes = getClasses(error, className);

    return (
      <>
        <input
          type={type}
          className={classes}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${props.id ?? props.name ?? ''}-${type}-error`}
          ref={ref as React.Ref<HTMLInputElement>}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        <Message
          variant="error"
          id={`${props.id}-${type}-error`}
          message={error}
          subtle
        />
      </>
    );
  }
);
Input.displayName = 'Input';

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    const classes = getClasses(error, className);

    return (
      <>
        <textarea
          className={`${classes} w-full h-32 min-h-full`}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${props.id}-textarea-error`}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        <Message variant="error" message={error} id={`${props.id}-textarea`} />
      </>
    );
  }
);
TextArea.displayName = 'TextArea';

export { Input, TextArea };
