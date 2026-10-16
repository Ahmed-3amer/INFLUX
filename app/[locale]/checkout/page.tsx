import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LocalePageProps } from '@/types';
import Container from '@/components/ui/Container';
import CheckoutForm from './CheckoutForm';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'إتمام الطلب | INFLUX' : 'Checkout | INFLUX',
  };
}

export default async function CheckoutPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container>
      <CheckoutForm />
    </Container>
  );
}
