import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '~/components/ui/dialog';
import { useState } from 'react';
import Button from '~/components/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command';
import { cn } from '~/lib/utils';
import Icon from '~/components/Icon';
import * as React from 'react';
import Message from '~/components/Message';

export type ListItem = {
  id: string;
  label: string;
};

export type ListSelectorLabels = {
  title: string;
  addButtonLabel: string;
  noItemsLabel: string;
  dialogTitle: string;
  dialogDescription: string;
};

interface BaseProps {
  labels: ListSelectorLabels;
  items: ListItem[];
  error?: string;
  multiple?: boolean;
}

export interface SingleSelectProps extends BaseProps {
  multiple?: false;
  selectedId?: string;
  onSelect: (id: string) => void;
  selectedIds?: never;
}

export interface MultiSelectProps extends BaseProps {
  multiple?: true;
  selectedIds?: string[];
  onSelect: (ids: string[]) => void;
  selectedId?: never;
}

export type Props = SingleSelectProps | MultiSelectProps;

export default function ListSelector({
  labels,
  items,
  error,
  multiple,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | string[]>(
    (multiple ? props.selectedIds : props.selectedId) ?? ''
  );
  let hasSelected: boolean;
  if (multiple) {
    hasSelected = !!selected.length;
  } else {
    hasSelected = !!selected;
  }

  const isValueSelected = (item: ListItem) => {
    if (multiple) {
      return (selected as string[]).includes(item.id);
    } else {
      return selected === item.id;
    }
  };

  const handleSelect = (id: string) => {
    if (multiple) {
      const newSelected = (selected as string[]).includes(id)
        ? (selected as string[]).filter((selectedId) => selectedId !== id)
        : [...(selected as string[]), id];
      setSelected(newSelected);
      (props as MultiSelectProps).onSelect(newSelected);
    } else {
      setSelected(id);
      (props as SingleSelectProps).onSelect(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-4">
        <div>
          <h3 className={cn('text-xl', { 'text-dark-pink': !!error })}>
            {labels.title}
          </h3>

          <ul>
            {!hasSelected ? (
              <li className="text-neutral-500 italic">{labels.noItemsLabel}</li>
            ) : null}

            {hasSelected && multiple
              ? (selected as string[]).map((id) => (
                  <li key={id} className="text-neutral-500">
                    {items.find((item) => item.id === id)?.label}
                  </li>
                ))
              : null}

            {hasSelected && !multiple ? (
              <li key={selected as string} className="text-neutral-500">
                {items.find((item) => item.id === selected)?.label}
              </li>
            ) : null}
          </ul>
        </div>

        <Button type="button" onClick={() => setOpen(true)}>
          {labels.addButtonLabel}
        </Button>

        <Message variant="error" message={error} />
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.dialogTitle}</DialogTitle>
          <DialogDescription>{labels.dialogDescription}</DialogDescription>
        </DialogHeader>

        <div>
          <Command className="shadow-none">
            <CommandInput placeholder="Search..." />
            <CommandEmpty>Empty...</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={handleSelect}
                >
                  <Icon
                    name="check"
                    className={cn(
                      'mr-2 h-4 w-4',
                      isValueSelected(item) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
}
