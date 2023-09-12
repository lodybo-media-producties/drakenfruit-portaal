import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import {
  icon as fontAwesomeIcon,
  library,
  toHtml,
} from '@fortawesome/fontawesome-svg-core';
import * as faIcons from '~/utils/icons';

const icons = Object.values(faIcons);
library.add(...icons);

export type Props = {
  name: IconName;
  className?: React.HTMLAttributes<HTMLSpanElement>['className'];
  prefix?: Extract<IconPrefix, 'fas' | 'fab' | 'far'>;
  sizes?: 's' | 'm' | 'l' | 'xl' | 'full';
  faClasses?: string;
};

const sizeMap = new Map<Props['sizes'], string>();
sizeMap.set('s', 'fa-xs');
sizeMap.set('m', ''); // Default font-size
sizeMap.set('l', 'fa-2x');
sizeMap.set('xl', 'fa-3x');
sizeMap.set('full', 'fa-5x');

const Icon = ({
  name,
  prefix = 'fas',
  className = '',
  sizes = 'm',
  faClasses = '',
}: Props) => {
  const icon = fontAwesomeIcon(
    {
      prefix,
      iconName: name,
    },
    {
      classes: [faClasses, sizeMap.get(sizes) || ''],
    }
  ).abstract.shift();

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: toHtml(icon) }}
    />
  );
};

export default Icon;
