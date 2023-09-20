import { forwardRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import Icon from '~/components/Icon';

type Filter = {
  slug: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
};

type Props = {
  filters: Filter[];
  onSelectedFiltersChange: (selectedFilters: Filter[]) => void;
};

export default function SearchFilters({
  filters,
  onSelectedFiltersChange,
}: Props) {
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>(
    filters.filter(({ defaultChecked }) => defaultChecked)
  );

  const handleItemSelected = (filter: Filter) => {
    let updatedSelectedFilters: Filter[];

    if (filterIsSelected(filter)) {
      updatedSelectedFilters = selectedFilters.filter(
        (f) => f.slug !== filter.slug
      );
    } else {
      updatedSelectedFilters = [...selectedFilters, filter];
    }

    setSelectedFilters(updatedSelectedFilters);
    onSelectedFiltersChange(updatedSelectedFilters);
  };

  const filterIsSelected = (filter: Filter): boolean => {
    return (
      selectedFilters.find((item) => item.slug === filter.slug) !== undefined
    );
  };

  return (
    <div className="flex flex-col gap-2 h-20">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TriggerButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {filters.map((filter) => (
            <DropdownMenuCheckboxItem
              key={filter.slug}
              checked={filterIsSelected(filter)}
              onCheckedChange={() => handleItemSelected(filter)}
              defaultChecked={filter.defaultChecked}
              disabled={filter.disabled}
            >
              {filter.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedFilters.length ? (
        <small>
          Gekozen filters:{' '}
          {selectedFilters.map((filter) => filter.label).join(', ')}
        </small>
      ) : null}
    </div>
  );
}

const TriggerButton = forwardRef<HTMLButtonElement, {}>((props, ref) => (
  <button
    ref={ref}
    className="w-44 group relative rounded border-2 px-4 py-2 font-type text-lg transition-all motion-reduce:transition-none border-dark-blue bg-transparent text-black hover:border-light-blue/25 hover:bg-light-blue/25 data-[state=open]:border-light-blue/25 data-[state=open]:bg-light-blue/25"
    {...props}
  >
    Onderwerpen
    <Icon
      name="chevron-down"
      className="pl-2 transition-all opacity-50 group-hover:opacity-100 data-[state=open]:opacity-100 motion-reduce:transition-none"
    />
  </button>
));
TriggerButton.displayName = 'TriggerButton';
