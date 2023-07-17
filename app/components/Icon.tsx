import React from 'react';
import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { icon, library } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronRight);

export type Props = {
  className?: React.HTMLAttributes<HTMLSpanElement>['className'];
  prefix?: Extract<IconPrefix, 'fas' | 'fab' | 'far'>;
  name: IconName;
  iconClasses?: string;
  title?: string;
};

const Icon = ({
  name,
  prefix = 'fas',
  className = '',
  iconClasses = '',
  title = '',
}: Props) => {
  const iconHTML = icon(
    {
      prefix,
      iconName: name,
    },
    {
      classes: iconClasses,
      styles: {
        height: '1em',
      },
    }
  ).html;

  return (
    <span
      title={title}
      className={className}
      dangerouslySetInnerHTML={{ __html: iconHTML[0] }}
    />
  );
};

export default Icon;
