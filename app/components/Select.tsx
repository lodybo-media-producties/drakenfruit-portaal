import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import Message from '~/components/Message';
import * as React from 'react';

export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  options: SelectOption[];
  placeholder: string;
  initialValue?: string;
  error?: string;
  onValueChange: (value: string) => void;
};

export default function SelectInput({
  options,
  placeholder,
  initialValue,
  error,
  onValueChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Select onValueChange={onValueChange} defaultValue={initialValue}>
        <SelectTrigger error={error} className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Message variant="error" message={error} subtle />
    </div>
  );
}
