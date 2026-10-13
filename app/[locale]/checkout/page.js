import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import CheckoutForm from './CheckoutForm';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'إتمام الطلب | INFLUX' : 'Checkout | INFLUX',
  };
}

export default async function CheckoutPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container>
      <CheckoutForm />
    </Container>
  );
}
