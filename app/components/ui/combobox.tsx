import * as React from 'react';
import { inputClasses } from './input';

import { cn } from '~/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import Icon from '~/components/Icon';

export type ComboboxOption = {
  value: string;
  label: string;
};

type Props = {
  id?: string;
  options: ComboboxOption[];
  placeholder: string;
  notFoundMessage: string;
  onSelect?: (value: string) => void;
  triggerLabel?: string;
  initialValue?: string;
  error?: string;
};

export function Combobox({
  options,
  placeholder,
  notFoundMessage,
  onSelect,
  triggerLabel,
  error,
  initialValue = '',
  id = 'combobox',
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? '' : selectedValue;
    setValue(newValue);

    onSelect?.(newValue);

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-controls={id}
          aria-expanded={open}
          className={cn(
            `
              w-[200px]
              
              flex
              justify-between
              
              px-4 py-2
              
              rounded-md
              transition
              
              border
              
              bg-transparent
            `,
            {
              'border-dark-pink': error,
              'hover:bg-light-pink data-[state=open]:bg-light-pink': error,
              'border-light-blue hover:border-dark-blue data-[state=open]:border-dark-blue':
                !error,
              'hover:bg-light-blue data-[state=open]:bg-light-blue': !error,
            },
            inputClasses.focusAndFocusVisible
          )}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : triggerLabel ?? placeholder}
          <Icon name="sort" />
        </button>
      </PopoverTrigger>
      <PopoverContent id={id} className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{notFoundMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                value={option.value}
                key={option.value}
                onSelect={handleSelect}
              >
                <Icon
                  name="check"
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === option.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
