import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function Prose({ children }: Props) {
  return (
    <div
      className={`
    prose
    prose-sm
    sm:prose-base
    md:prose-lg
    xl:prose-2xl
    prose-a:text-dark-pink
    prose-a:border-b
    prose-a:border-b-dark-pink
    prose-a:pb-0.5
    prose-a:hover:pb-1
    transition-all
  `}
    >
      {children}
    </div>
  );
}
