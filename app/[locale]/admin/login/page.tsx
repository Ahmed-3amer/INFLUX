import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LocalePageProps } from '@/types';
import AdminLoginView from './AdminLoginView';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'دخول الإدارة | INFLUX' : 'Admin Login | INFLUX',
  };
}

export default async function AdminLoginPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminLoginView />;
}
