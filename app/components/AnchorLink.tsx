import { Link, type LinkProps } from '@remix-run/react';

type Props = LinkProps;

export default function AnchorLink({ className, children, ...props }: Props) {
  return (
    <Link
      className="text-dark-pink border-b border-b-dark-pink pb-0.5 hover:pb-1 transition-all"
      {...props}
    >
      {children}
    </Link>
  );
}
