import {
  Checkbox as UICheckbox,
  type CheckboxProps as UICheckboxProps,
} from '~/components/ui/checkbox';

type Props = UICheckboxProps & {
  label: string;
  subLabel?: string;
};

export default function Checkbox({
  label,
  subLabel,
  disabled,
  ...props
}: Props) {
  return (
    <label
      className={`flex flex-row gap-2.5 items-top ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <UICheckbox disabled={disabled} {...props} />

      <div>
        <p className={`${disabled ? 'text-neutral-600' : 'text-neutral-900'}`}>
          {label}
        </p>
        <small className="text-neutral-500">{subLabel}</small>
      </div>
    </label>
  );
}
