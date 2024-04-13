import PaymentForm from '~/components/PaymentForm';
import { type Issuer } from '~/payments.server';

type Props = {
  title: string;
  description: string;
  image: string;
  purchasePrice: number | null | undefined;
  issuers: Issuer[];
};

export default function PaymentWall({
  title,
  description,
  image,
  issuers,
  purchasePrice,
}: Props) {
  return (
    <div className="w-full lg:w-3/4 mx-auto p-12 flex flex-col md:flex-row gap-20">
      <div className="flex flex-col gap-4 w-full lg:w-2/3">
        <h1 className="text-6xl font-type">{title}</h1>
        <p>{description}</p>
        <img src={image} alt={title} />
      </div>

      <div className="w-full lg:w-1/3">
        <PaymentForm issuers={issuers} price={purchasePrice} locale="nl" />
      </div>
    </div>
  );
}
