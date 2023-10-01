import { Input, type TextInputProps } from '~/components/ui/input';
import Label from '~/components/Label';

type Props = Omit<TextInputProps, 'type'> & {
  label: string;
};

export default function TextInput({ label, error, ...props }: Props) {
  return (
    <Label label={label} required={props.required}>
      <Input type="text" {...props} error={error} />
    </Label>
  );
}
