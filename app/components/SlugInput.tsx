import { Input, type TextInputProps } from '~/components/ui/input';
import { Label as UILabel } from '~/components/ui/label';
import { inputClasses } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import Message from '~/components/Message';

type Props = Omit<TextInputProps, 'type'> & {
  label: string;
};

export default function SlugInput({
  label,
  error,
  required,
  className,
  ...props
}: Props) {
  return (
    <UILabel className="w-full text flex flex-col gap-2">
      <span className="flex flex-row gap-0.5 items-center">
        {label} {required && <span className="text-dark-pink text-xl">*</span>}
      </span>

      <span
        className={cn(
          `flex flex-row gap-1 items-center pl-3`,
          className,
          inputClasses.focusWithin,
          inputClasses.borderAndBg,
          {
            'border-dark-pink': error,
            'border-2': error,
          }
        )}
      >
        <small className="text-neutral-500">
          https://portaal.drakenfruit.com/artikel/
        </small>
        <Input
          className="border-none bg-transparent pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          type="text"
          {...props}
        />
      </span>
      <Message variant="error" message={error} subtle />
    </UILabel>
  );
}
