import { getProducts } from '@/lib/products';
import { setRequestLocale } from 'next-intl/server';
import { LocalePageProps } from '@/types';
import Hero from '@/components/home/Hero';
import Philosophy from '@/components/home/Philosophy';
import CollectionSection from '@/components/home/CollectionSection';

export default async function HomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts();

  return (
    <>
      <Hero />
      <Philosophy />
      <CollectionSection products={products} />
    </>
  );
}
