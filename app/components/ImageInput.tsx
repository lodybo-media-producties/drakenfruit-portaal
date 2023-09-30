import Label from '~/components/Label';
import Button from '~/components/Button';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import Icon from '~/components/Icon';

type Props = {
  label: string;
  name?: string;
  multiple?: boolean;
  initialValue?: string | null;
  value?: string | null;
  onChange?: (value: string) => void;
};

export default function ImageInput({
  label,
  name,
  multiple,
  initialValue,
  value,
  onChange,
}: Props) {
  const [fileName, setFileName] = useState<string | null | undefined>(
    initialValue ?? value
  );
  const { t } = useTranslation('components');
  const ref = useRef<HTMLInputElement | null>(null);

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
  }, []);

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
        accept="image/*"
      />
      <Label label={label}>
        <Button className="w-3/4" type="button" onClick={toggleFilePicker}>
          {t('ImageInput.Button Label')}
        </Button>
      </Label>
      {fileName?.length ? (
        <small>
          {t('ImageInput.Image Selected Label', {
            count: fileName.length,
          })}
          {getFileNames()}
        </small>
      ) : null}
    </div>
  );
}
