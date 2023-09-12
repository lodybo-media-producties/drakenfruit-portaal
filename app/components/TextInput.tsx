import { Input, type InputProps } from '~/components/ui/input';
import Label from '~/components/Label';

type Props = Omit<InputProps, 'type'> & {
  label: string;
};

export default function TextInput({ label, ...props }: Props) {
  return (
    <Label label={label}>
      <Input type="text" {...props} />
    </Label>
  );
}
