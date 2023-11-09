import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { Link, type LinkProps } from '@remix-run/react';
import Icon from '~/components/Icon';
import { forwardRef } from 'react';
import { cn } from '~/lib/utils';
import Loader from '~/components/Loader';

type BaseProps = {
  /**
   * Whether the button should have primary styles or not.
   */
  primary?: boolean;

  /**
   * Whether the button has animations
   */
  animated?: boolean;

  /**
   * Whether the action of the button is currently loading
   */
  loading?: boolean;
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
  (
    { children, primary = false, animated = true, className, ...props },
    ref
  ) => {
    let disabled: boolean | undefined = false;
    if ('disabled' in props) {
      disabled = props.disabled;
    }

    const canAnimate = !disabled && animated;

    const classes = cn(
      `group relative rounded border-2 px-4 py-2 font-type text-lg transition-all disabled:cursor-not-allowed disabled:opacity-50`,
      {
        'border-dark-pink bg-dark-pink text-white': primary,
        'border-dark-blue bg-transparent text-black hover:border-light-blue/25 hover:bg-light-blue/25 disabled:hover:bg-transparent disabled:border-dark-blue':
          !primary,
        'motion-reduce:transition-none hover:pr-8': canAnimate,
      },
      className
    );

    if ('to' in props) {
      const { to = '', ...restProps } = props as ButtonLinkProps;

      return (
        <Link to={to} className={`inline-block ${classes}`} {...restProps}>
          <ButtonContents
            isLoading={restProps.loading}
            canAnimate={canAnimate}
            primary={primary}
          >
            {children}
          </ButtonContents>
        </Link>
      );
    }

    // Take the className prop out of the props object, because we don't need it anymore.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const buttonProps = props as ButtonProps;
    return (
      <button ref={ref} className={classes} {...buttonProps}>
        <ButtonContents
          isLoading={buttonProps.loading}
          canAnimate={canAnimate}
          primary={primary}
        >
          {children}
        </ButtonContents>
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;

type ButtonContentProps = {
  children: ReactNode;
  isLoading?: boolean;
  canAnimate?: boolean;
  primary?: boolean;
};

export const ButtonContents = ({
  children,
  isLoading,
  canAnimate,
  primary,
}: ButtonContentProps) => (
  <span className="flex flex-row gap-2">
    {isLoading ? <Loader sizes="s" light={primary} /> : null}
    {children}
    {canAnimate ? (
      <Icon
        name="chevron-right"
        className="absolute right-2 opacity-0 transition group-hover:opacity-100 motion-reduce:transition-none"
      />
    ) : null}
  </span>
);
