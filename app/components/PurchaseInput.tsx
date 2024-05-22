import Checkbox from '~/components/Checkbox';
import { useState } from 'react';
import { inputStyles } from '~/components/ui/input';
import Label from '~/components/Label';
import CurrencyInput, {
  type CurrencyInputOnChangeValues,
} from 'react-currency-input-field';
import Message from '~/components/Message';
import { useTranslation } from 'react-i18next';

export type PurchaseInputValues = {
  purchasable: boolean;
  purchasePrice?: number | null;
};

type Props = {
  initialValues?: PurchaseInputValues;
  error?: string;
  onChange: (values: PurchaseInputValues) => void;
  width?: string;
};

export default function PurchaseInput({
  onChange,
  initialValues,
  error,
  width,
}: Props) {
  const { t } = useTranslation('components');
  const [purchasable, setPurchasable] = useState(
    initialValues?.purchasable ?? false
  );
  const [purchasePrice, setPurchasePrice] = useState<number | undefined>(
    initialValues?.purchasePrice ?? undefined
  );
  const [purchasePriceCaption, setPurchasePriceCaption] = useState<
    string | undefined
  >(initialValues?.purchasePrice?.toString(10) ?? undefined);

  const handlePurchasableChange = (value: boolean) => {
    setPurchasable(value);
    onChange({
      purchasable: value,
      purchasePrice: value ? purchasePrice : undefined,
    });
  };

  const handlePurchasePriceChange = (
    value: string | undefined,
    name: string | undefined,
    values: CurrencyInputOnChangeValues | undefined
  ) => {
    setPurchasePrice(values?.float ?? undefined);
    setPurchasePriceCaption(values?.value ?? undefined);
    onChange({ purchasable, purchasePrice: values?.float });
  };

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        label={t('PurchaseInput.ItemIsPurchasable')}
        name="purchasable"
        checked={purchasable}
        onCheckedChange={handlePurchasableChange}
      />

      {purchasable ? (
        <div className={width ? width : 'w-48'}>
          <Label label={t('PurchaseInput.PurchasePrice')}>
            <CurrencyInput
              className={inputStyles}
              intlConfig={{ locale: 'nl-NL', currency: 'EUR' }}
              prefix="€"
              decimalsLimit={2}
              value={purchasePriceCaption}
              onValueChange={handlePurchasePriceChange}
            />
          </Label>
        </div>
      ) : null}

      {error ? <Message variant="error" message={error} /> : null}
    </div>
  );
}
