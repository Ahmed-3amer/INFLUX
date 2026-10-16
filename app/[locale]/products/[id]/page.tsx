import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getProductById, getProducts } from '@/lib/products';
import { routing } from '@/i18n/routing';
import { LocalePageProps } from '@/types';
import Container from '@/components/ui/Container';
import ProductPurchaseZone from '@/components/product/ProductPurchaseZone';
import ScentWheel from '@/components/product/ScentWheel';
import ProductPerformance from '@/components/product/ProductPerformance';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/product/ProductCard';

export async function generateStaticParams() {
  const products = await getProducts();
  const params: Array<{ locale: string; id: string }> = [];

  for (const locale of routing.locales) {
    for (const product of products) {
      params.push({
        locale,
        id: product.id,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: LocalePageProps<{ id: string }>): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await getProductById(id);

  if (!product) return {};

  const isAr = locale === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;

  return {
    title: `${name} | INFLUX`,
    description,
    openGraph: {
      title: `${name} — INFLUX Haute Parfumerie`,
      description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: LocalePageProps<{ id: string }>) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 2);

  const isAr = locale === 'ar';

  return (
    <Container>
      <ProductPurchaseZone product={product} />
      <ScentWheel product={product} />
      <ProductPerformance product={product} />

      {/* Related Fragrances */}
      <div style={{ marginTop: 'var(--space-20)', marginBottom: 'var(--space-16)' }}>
        <SectionHeading
          eyebrow={isAr ? 'اكتشف المزيد' : 'Curated Compositions'}
          title={isAr ? 'إبداعات أخرى من الدار' : 'More From The House'}
          subtitle={
            isAr
              ? 'توليفات فريدة تُكمل ذوقك وتمنحك خيارات متنوعة لمختلف أوقاتك.'
              : 'Distinct creations to enrich your olfactory wardrobe.'
          }
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-8)',
          }}
        >
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </Container>
  );
}
