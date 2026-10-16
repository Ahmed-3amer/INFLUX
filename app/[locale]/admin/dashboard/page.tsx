import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { productRepository } from '@/lib/data-access';
import { LocalePageProps } from '@/types';
import AdminDashboardView from './AdminDashboardView';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'لوحة التحكم | INFLUX' : 'Admin Dashboard | INFLUX',
  };
}

export default async function AdminDashboardPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await productRepository.getAll();

  return <AdminDashboardView initialProducts={products} />;
}
