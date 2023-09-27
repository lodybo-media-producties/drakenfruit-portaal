import type { ReactNode } from 'react';
import { Label as UILabel } from '~/components/ui/label';

interface BaseProps {
  label: string;
}

interface ForProps extends BaseProps {
  htmlFor: string;
  children: never;
}

interface ChildrenProps extends BaseProps {
  htmlFor?: never;
  children: ReactNode;
}

type Props = ForProps | ChildrenProps;

export default function Label({ label, children, htmlFor }: Props) {
  return (
    <UILabel className="w-full text flex flex-col gap-2" htmlFor={htmlFor}>
      {label}
      {children}
    </UILabel>
  );
}
