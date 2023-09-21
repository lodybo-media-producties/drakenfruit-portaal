import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import Icon from '~/components/Icon';
import { forwardRef } from 'react';

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  /**
   * The contents of the button.
   */
  children: ReactNode;

  /**
   * Whether the button should have primary styles or not.
   */
  primary?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, primary = false, ...props }, ref) => (
    <button
      ref={ref}
      className={`group relative rounded border-2 px-4 py-2 font-type text-lg transition-all motion-reduce:transition-none
      ${
        primary
          ? 'border-dark-pink bg-dark-pink text-white'
          : 'border-dark-blue bg-transparent text-black hover:border-light-blue/25 hover:bg-light-blue/25'
      }
      hover:pr-8
    `}
      {...props}
    >
      {children}
      <Icon
        name="chevron-right"
        className="absolute right-2 opacity-0 transition group-hover:opacity-100 motion-reduce:transition-none"
      />
    </button>
  )
);
Button.displayName = 'Button';

export default Button;
