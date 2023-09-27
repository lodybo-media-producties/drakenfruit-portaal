import { Input, type InputProps } from '~/components/ui/input';
import Label from '~/components/Label';
import { cn } from '~/lib/utils';

type Props = Omit<InputProps, 'type'> & {
  label: string;
  error?: string;
};

export default function EmailInput({ label, error, ...props }: Props) {
  return (
    <Label label={label}>
      <Input
        className={cn({
          'border-dark-pink': error,
          'border-2': error,
        })}
        type="email"
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${props.id}-email-error`}
      />
      {error ? (
        <div className="pt-1 text-dark-pink " id={`${props.id}-email-error`}>
          {error}
        </div>
      ) : null}
    </Label>
  );
}
