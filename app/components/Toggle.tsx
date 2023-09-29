import { useState } from 'react';
import { inputClasses } from '~/components/ui/input';

export type ToggleOption = {
  label: string;
  value: string;
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
          key={option.value}
          className={`flex-1 py-1 px-6 transition-colors ${
            inputClasses.focusAndFocusVisible
          } ${
            option.value === selectedOption.value
              ? 'bg-dark-blue text-egg-white'
              : ''
          }`}
          onClick={() => handleSelect(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
