import { Link, type LinkProps } from '@remix-run/react';
import { cn } from '~/lib/utils';

type Props = LinkProps;

export default function AnchorLink({
  className,
  children,
  to,
  ...props
}: Props) {
  const classes = cn(
    'text-dark-pink border-b border-b-dark-pink pb-0.5 hover:pb-1 transition-all',
    className
  );

  if (typeof to === 'string' && /^https?:\/\//.test(to)) {
    return (
      <a className={classes} href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} to={to} {...props}>
      {children}
    </Link>
  );
}
