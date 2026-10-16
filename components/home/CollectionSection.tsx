'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Product } from '@/types';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/product/ProductCard';
import { ShieldCheck, Truck } from 'lucide-react';
import styles from './CollectionSection.module.css';

export interface CollectionSectionProps {
  products: Product[];
}

export default function CollectionSection({ products }: CollectionSectionProps) {
  const t = useTranslations('products');
  const common = useTranslations('common');

  return (
    <section id="collection" className={styles.section}>
      <Container>
        <SectionHeading
          eyebrow={t('scentProfile')}
          title={t('sectionTitle')}
          subtitle={t('sectionSubtitle')}
        />

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Editorial Promise Banner */}
        <div className={styles.promiseBanner}>
          <div className={styles.promiseItem}>
            <ShieldCheck size={28} className={styles.promiseIcon} />
            <div>
              <h4 className={styles.promiseTitle}>ضمان التجربة الفاخرة</h4>
              <p className={styles.promiseDesc}>{t('sampleOffer')}</p>
            </div>
          </div>

          <div className={styles.promiseItem}>
            <Truck size={28} className={styles.promiseIcon} />
            <div>
              <h4 className={styles.promiseTitle}>{common('freeShipping')}</h4>
              <p className={styles.promiseDesc}>{t('shippingNotice')}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
