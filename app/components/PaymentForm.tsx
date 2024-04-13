import { type Issuer } from '~/payments.server';
import { type SupportedLanguages } from '~/i18n';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '~/utils/utils';
import Select, { type SelectOption } from './Select';
import { useEffect, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { type APIResponse } from '~/types/Responses';
import Button from '~/components/Button';
import Message from '~/components/Message';

type Props = {
  issuers: Issuer[];
  price: number | null;
  locale: SupportedLanguages;
};

export default function PaymentForm({ issuers, price }: Props) {
  const [selectedIssuer, setSelectedIssuer] = useState('');
  const fetcher = useFetcher<APIResponse>();

  const [error, setError] = useState('');

  const { t } = useTranslation('components');

  const options: SelectOption[] = issuers.map((issuer) => ({
    value: issuer.id,
    label: issuer.name,
    icon: issuer.image.size1x,
  }));

  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data as APIResponse;
      if (!data.ok) {
        setError(data.message);
      }
    }
  }, [fetcher.data]);

  const handleSelectIssuer = (value: string) => {
    setSelectedIssuer(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    fetcher.submit(form, {
      action: '/api/payments',
      method: 'POST',
    });
  };

  const isSubmitting = fetcher.state !== 'idle';

  const formattedPrice = formatCurrency(price ?? 0);

  return (
    <form className="space-y-12" onSubmit={handleSubmit}>
      <div className="space-y-4 text-center">
        <h2 className="text-6xl font-type">{t('PaymentWall.Title')}</h2>
        <p className="text-lg">{t('PaymentWall.Description')}</p>
      </div>

      <p className="text-center text-4xl font-type">{formattedPrice}</p>

      <div className="space-y-2">
        <p>{t('PaymentWall.SelectIssuerLabel')}</p>
        <Select
          options={options}
          onValueChange={handleSelectIssuer}
          placeholder={t('PaymentWall.SelectIssuerPlaceholder')}
        />
        <input type="hidden" name="issuer" value={selectedIssuer} />
        {error ? <Message variant="error" message={error} /> : null}
      </div>

      <div className="w-full flex justify-end">
        <Button
          disabled={isSubmitting}
          loading={isSubmitting}
          type="submit"
          primary
        >
          {t('PaymentWall.PayButtonLabel', { price: formattedPrice })}
        </Button>
      </div>
    </form>
  );
}
