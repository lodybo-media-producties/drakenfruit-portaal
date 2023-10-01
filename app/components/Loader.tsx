import Icon, { type Props as IconProps } from '~/components/Icon';
import { cn } from '~/lib/utils';

type Props = {
  light?: boolean;
  sizes?: IconProps['sizes'];
};

export default function Loader({ light, sizes = 'xl' }: Props) {
  return (
    <Icon
      className={cn({
        'text-dark-pink': !light,
        'text-light-pink': light,
      })}
      name="spinner"
      sizes={sizes}
      faClasses="fa-spin"
    />
  );
}
