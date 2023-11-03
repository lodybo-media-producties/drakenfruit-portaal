import Label from '~/components/Label';
import Button from '~/components/Button';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import Icon from '~/components/Icon';
import Message from '~/components/Message';
import { cn } from '~/lib/utils';

type Props = {
  label: string;
  name?: string;
  multiple?: boolean;
  initialValue?: string | null;
  value?: string | null;
  onChange?: (value: string) => void;
  accept?: string;
  error?: string;
  disabled?: boolean;
};

export default function FileInput({
  label,
  name,
  multiple,
  initialValue,
  value,
  onChange,
  accept,
  error,
  disabled,
}: Props) {
  const [fileName, setFileName] = useState<string | null | undefined>(
    initialValue ?? value
  );
  const { t } = useTranslation('components');
  const ref = useRef<HTMLInputElement | null>(null);
  let fileTypeTranslationGroup = 'File';

  if (accept?.includes('image')) {
    fileTypeTranslationGroup = 'Image';
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.onchange = (event) => {
        const { files } = event.target as HTMLInputElement;
        setFileName(files ? files[0].name : null);
        if (onChange) {
          onChange(files ? files[0].name : '');
        }
      };
    }
  }, [onChange]);

  const toggleFilePicker = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const getFileNames = () => {
    if (fileName) {
      return (
        <span key={fileName}>
          <span className="font-bold">{fileName}</span>
          <button className="ml-1" onClick={handleDelete}>
            <Icon name="times" />
          </button>
        </span>
      );
    }
  };

  const handleDelete = () => {
    setFileName(null);
    if (ref.current) {
      ref.current.value = '';
    }
  };

  return (
    <div className="w-64 flex flex-col gap-2">
      <input
        name={name}
        multiple={multiple}
        type="file"
        ref={ref}
        className="hidden"
        accept={accept}
        disabled={disabled}
      />
      <Label label={label}>
        <Button
          className={cn({
            'border-dark-pink': error,
            'border-2': error,
            'hover:bg-light-pink': error,
            'hover:border-dark-pink': error,
            'hover:border-2': error,
          })}
          type="button"
          onClick={toggleFilePicker}
          disabled={disabled}
        >
          {t(`FileInput.${fileTypeTranslationGroup}.Button Label`)}
        </Button>
      </Label>
      {fileName?.length ? (
        <small>
          {t(`FileInput.${fileTypeTranslationGroup}.Selected Label`, {
            count: fileName.length,
          })}
          {getFileNames()}
        </small>
      ) : null}
      {error ? <Message variant="error" message={error} /> : null}
    </div>
  );
}
