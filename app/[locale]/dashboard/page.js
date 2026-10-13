import { setRequestLocale } from 'next-intl/server';
import { getProducts } from '@/lib/products';
import Container from '@/components/ui/Container';
import DashboardView from './DashboardView';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'لوحة التحكم | INFLUX' : 'Admin Dashboard | INFLUX',
  };
}

export default async function DashboardPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts();

  return (
    <Container>
      <DashboardView initialProducts={products} />
    </Container>
  );
}
