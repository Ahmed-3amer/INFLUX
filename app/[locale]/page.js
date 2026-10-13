import { getProducts } from '@/lib/products';
import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import Philosophy from '@/components/home/Philosophy';
import CollectionSection from '@/components/home/CollectionSection';

export default async function HomePage({ params }) {
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
