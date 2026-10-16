import { redirect } from 'next/navigation';
import { LocalePageProps } from '@/types';

export default async function LegacyDashboardRedirect({ params }: LocalePageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin/dashboard`);
}
