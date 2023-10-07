import { Link, type LinkProps } from '@remix-run/react';
import { cn } from '~/lib/utils';

type Props = LinkProps;

export default function AnchorLink({ className, children, ...props }: Props) {
  return (
    <Link
      className={cn(
        'text-dark-pink border-b border-b-dark-pink pb-0.5 hover:pb-1 transition-all',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
