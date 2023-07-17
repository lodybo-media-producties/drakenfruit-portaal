import type { ReactNode } from 'react';
import Icon from '~/components/Icon';

type Props = {
  /**
   * The contents of the button.
   */
  children: ReactNode;

  /**
   * Whether the button should have primary styles or not.
   */
  primary?: boolean;
};

export default function Button({ children, primary = false }: Props) {
  return (
    <button
      className={`group relative rounded border-2 px-4 py-2 font-type text-lg transition-all motion-reduce:transition-none
      ${
        primary
          ? 'border-dark-pink bg-dark-pink text-white'
          : 'border-dark-blue bg-transparent text-black hover:border-light-blue/10 hover:bg-light-blue/25'
      }
      hover:pr-8
    `}
    >
      {children}
      <Icon
        name="chevron-right"
        className="absolute right-2 opacity-0 transition group-hover:opacity-100 motion-reduce:transition-none"
      />
    </button>
  );
}
