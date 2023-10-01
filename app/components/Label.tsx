import type { ReactNode } from 'react';
import { Label as UILabel } from '~/components/ui/label';

interface BaseProps {
  label: string;
  required?: boolean;
}

interface ForProps extends BaseProps {
  htmlFor: string;
  children?: never;
}

interface ChildrenProps extends BaseProps {
  htmlFor?: never;
  children: ReactNode;
}

type Props = ForProps | ChildrenProps;

export default function Label({ label, children, htmlFor, required }: Props) {
  if (htmlFor) {
    return (
      <UILabel className="w-full text flex flex-col gap-2" htmlFor={htmlFor}>
        <span className="flex flex-row gap-0.5 items-center">
          {label}{' '}
          {required && <span className="text-dark-pink text-xl">*</span>}
        </span>
      </UILabel>
    );
  }

  return (
    <UILabel className="w-full text flex flex-col gap-2">
      <span className="flex flex-row gap-0.5 items-center">
        {label} {required && <span className="text-dark-pink text-xl">*</span>}
      </span>
      {children}
    </UILabel>
  );
}
