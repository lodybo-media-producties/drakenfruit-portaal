import Icon, { type Props as IconProps } from '~/components/Icon';
import { cn } from '~/lib/utils';
import { forwardRef } from 'react';

type Props = {
  onClick?: () => void;
  icon: IconProps['name'];
  destructive?: boolean;
};

const ActionButton = forwardRef<HTMLButtonElement, Props>(
  ({ onClick, icon, destructive, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        `rounded-md px-4 py-2 opacity-80 hover:opacity-100 transition-opacity`,
        {
          'bg-light-blue': !destructive,
          'bg-dark-pink text-egg-white': destructive,
        }
      )}
    >
      <Icon name={icon} />
    </button>
  )
);
ActionButton.displayName = 'ActionButton';

export default ActionButton;
