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

interface BaseProps {
  id?: string;
  options: ComboboxOption[];
  placeholder: string;
  notFoundMessage: string;
  triggerLabel?: string;
  showSelectedInTrigger?: boolean;
  error?: string;
  multiple?: boolean;
}

interface SingleSelectProps extends BaseProps {
  multiple?: false;
  initialValue?: string;
  onSelect?: (value: string) => void;

  initialValues?: never;
}

interface MultiSelectProps extends BaseProps {
  multiple: true;
  onSelect?: (value: string[]) => void;
  initialValues?: string[];
  initialValue?: never;
}

type Props = SingleSelectProps | MultiSelectProps;

export function Combobox({
  options,
  placeholder,
  notFoundMessage,
  onSelect,
  triggerLabel,
  showSelectedInTrigger,
  error,
  multiple,
  initialValue = '',
  initialValues = [],
  id = 'combobox',
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(
    multiple ? initialValues : initialValue
  );

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === value ? '' : selectedValue;

    if (multiple) {
      const newValues = value.includes(selectedValue)
        ? (value as string[]).filter((v) => v !== selectedValue)
        : [...value, selectedValue];

      setValue(newValues);
      onSelect?.(newValues);
    } else {
      setValue(newValue);
      onSelect?.(newValue);
    }

    setOpen(false);
  };

  const isValueSelected = (option: ComboboxOption) => {
    if (multiple) {
      return value.includes(option.value);
    }

    return option.value === value;
  };

  const getValueLabel = () => {
    if (!showSelectedInTrigger) {
      return triggerLabel ?? placeholder;
    }

    let label: string | undefined;

    if (multiple) {
      label = (value as string[])
        .map((v) => options.find((o) => o.value === v)?.label)
        .join(', ');
    } else {
      label = options.find((o) => o.value === value)?.label;
    }

    if (label) {
      return label;
    }

    return triggerLabel ?? placeholder;
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
          {getValueLabel()}
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
                    isValueSelected(option) ? 'opacity-100' : 'opacity-0'
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
