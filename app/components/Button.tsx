import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { Link, type LinkProps } from '@remix-run/react';
import Icon from '~/components/Icon';
import { forwardRef } from 'react';

type BaseProps = {
  /**
   * Whether the button should have primary styles or not.
   */
  primary?: boolean;
};

interface ButtonProps
  extends DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    BaseProps {
  to?: never;
}

interface ButtonLinkProps extends LinkProps, BaseProps {}

type Props = ButtonProps | ButtonLinkProps;

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, primary = false, ...props }, ref) => {
    const classes = `group relative rounded border-2 px-4 py-2 font-type text-lg transition-all motion-reduce:transition-none
      ${
        primary
          ? 'border-dark-pink bg-dark-pink text-white'
          : 'border-dark-blue bg-transparent text-black hover:border-light-blue/25 hover:bg-light-blue/25'
      }
      hover:pr-8
    `;

    if ('to' in props) {
      const { to = '', className, ...restProps } = props as LinkProps;

      return (
        <Link to={to} className={classes} {...restProps}>
          {children}
          <Icon
            name="chevron-right"
            className="absolute right-2 opacity-0 transition group-hover:opacity-100 motion-reduce:transition-none"
          />
        </Link>
      );
    }

    // Take the className prop out of the props object, because we don't need it anymore.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { className = '', ...restProps } = props as ButtonProps;
    return (
      <button ref={ref} className={classes} {...restProps}>
        {children}
        <Icon
          name="chevron-right"
          className="absolute right-2 opacity-0 transition group-hover:opacity-100 motion-reduce:transition-none"
        />
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
