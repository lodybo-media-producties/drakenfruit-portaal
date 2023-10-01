import { useState } from 'react';
import { inputClasses } from '~/components/ui/input';

export type ToggleOption = {
  label: string;
  value: string;
  notificationCount?: number;
};

type Props = {
  options: ToggleOption[];
  onSelect?: (value: string) => void;
};

export default function Toggle({ options, onSelect }: Props) {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelect = (option: ToggleOption) => {
    setSelectedOption(option);

    if (onSelect) {
      onSelect(option.value);
    }
  };

  return (
    <div className="flex flex-row gap-0 border border-dark-blue bg-light-blue">
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={`flex-1 py-1 px-6 transition-colors relative ${
            inputClasses.focusAndFocusVisible
          } ${
            option.value === selectedOption.value
              ? 'bg-dark-blue text-egg-white'
              : ''
          }`}
          onClick={() => handleSelect(option)}
        >
          {option.label}
          {option.notificationCount ? (
            <div className="absolute top-1 right-1 bg-dark-pink text-egg-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {option.notificationCount}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}
