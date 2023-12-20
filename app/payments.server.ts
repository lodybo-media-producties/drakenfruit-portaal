import createMollieClient, {
  Locale,
  MethodInclude,
  PaymentMethod,
} from '@mollie/api-client';
import { type MethodData } from '@mollie/api-client/dist/types/src/data/methods/data';
import { SupportedLanguages } from '~/i18n';

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export interface Issuer {
  id: string;
  image: {
    size1x: string;
    size2x: string;
    svg: string;
  };
  name: string;
  resource: string;
}

export type MethodWithIssuers = MethodData & { issuers: Issuer[] };

export function getiDEALIssuers(): Promise<MethodWithIssuers> {
  return mollieClient.methods.get('ideal', {
    include: MethodInclude.issuers,
    locale: Locale.nl_NL,
  }) as unknown as Promise<MethodWithIssuers>;
}

export function getPaymentMethods(): Promise<MethodData[]> {
  return mollieClient.methods.list({
    locale: Locale.nl_NL,
  }) as unknown as Promise<MethodData[]>;
}

type CreatePaymentArgs = {
  value: string;
  locale: SupportedLanguages;
  description: string;
  method: PaymentMethod;
  issuer: string;
};
export function createPayment({
  value,
  locale,
  description,
  method,
  issuer,
}: CreatePaymentArgs) {
  return mollieClient.payments.create({
    amount: {
      currency: 'EUR',
      value,
    },
    description,
    locale: locale === 'nl' ? Locale.nl_NL : Locale.en_US,
    method,
    issuer,
  });
}
