import { TextArea, type TextAreaProps } from '~/components/ui/input';
import Label from '~/components/Label';

type Props = TextAreaProps & {
  label: string;
};

export default function TextAreaInput({ label, error, ...props }: Props) {
  return (
    <Label label={label} required={props.required}>
      <TextArea {...props} error={error} />
    </Label>
  );
}
