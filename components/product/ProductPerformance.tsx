'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Product } from '@/types';
import styles from './ProductPerformance.module.css';

export interface ProductPerformanceProps {
  product: Product;
}

export default function ProductPerformance({ product }: ProductPerformanceProps) {
  const t = useTranslations('products');
  const locale = useLocale();

  const isAr = locale === 'ar';
  const longevity = isAr ? product.longevityAr : product.longevityEn;
  const sillage = isAr ? product.sillageAr : product.sillageEn;
  const occasion = isAr ? product.occasionAr : product.occasionEn;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {/* Longevity Card */}
        <div className={styles.perfCard}>
          <span className={styles.perfLabel}>{t('longevity')}</span>
          <h4 className={styles.perfValue}>{longevity}</h4>
          <p className={styles.perfDesc}>
            {isAr
              ? 'مُقطر بتركيز استثنائي من الزيوت النقية ليضمن بقاء النوتات القاعدية لساعات ممتدة.'
              : 'Formulated with an ultra-high concentration of perfume oils ensuring an enduring base trail.'}
          </p>
        </div>

        {/* Sillage Card */}
        <div className={styles.perfCard}>
          <span className={styles.perfLabel}>{t('sillage')}</span>
          <h4 className={styles.perfValue}>{sillage}</h4>
          <p className={styles.perfDesc}>
            {isAr
              ? 'أثر عطري حميمي ومميز يترك انطباعاً راقياً دون أن يفرض نفسه بشكل صاخب.'
              : 'An intimate olfactory cloud that leaves a memorable impression without overwhelming presence.'}
          </p>
        </div>

        {/* Recommended Occasion */}
        <div className={styles.perfCard}>
          <span className={styles.perfLabel}>
            {isAr ? 'الأوقات الملائمة' : 'Best Occasions'}
          </span>
          <h4 className={styles.perfValue}>{occasion}</h4>
          <p className={styles.perfDesc}>
            {isAr
              ? 'توليفة متوازنة صُممت لتلائم طابعك المميز وتتناغم مع حرارة الجسم.'
              : 'A harmonious blend composed to complement your signature persona across meaningful settings.'}
          </p>
        </div>
      </div>

      {/* Discovery Vial Guarantee */}
      <div className={styles.sampleBox}>
        <div className={styles.sealMark}>
          <Image
            src="/images/brand/PP.png"
            alt="INFLUX Seal"
            width={72}
            height={72}
            className={styles.sealImg}
          />
        </div>
        <div className={styles.sampleContent}>
          <h4 className={styles.sampleTitle}>
            {isAr ? 'ميزة تجربة العينة المجانية (Discovery Vial)' : 'Complimentary Discovery Vial'}
          </h4>
          <p className={styles.sampleText}>
            {isAr
              ? 'نرفق مع كل عبوة عينة مستقلة حجم ٢ مل لتجربتها على بشرتك أولاً. إذا لم تتوافق الرائحة مع ذوقك، يمكنك استرجاع العبوة الرئيسية دون أي تكلفة شريطة عدم فتح الغلاف الخارجي.'
              : 'Every flacon arrives with an individual 2ml discovery vial. Test the scent on your skin first; if it does not meet your desires, you may return the unopened full-sized box at zero hassle.'}
          </p>
        </div>
      </div>
    </div>
  );
}
