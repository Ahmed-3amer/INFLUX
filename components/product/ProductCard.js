'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/lib/cart-context';
import Button from '@/components/ui/Button';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const t = useTranslations('products');
  const common = useTranslations('common');
  const locale = useLocale();
  const { addToCart } = useCart();

  const name = locale === 'ar' ? product.nameAr : product.nameEn;
  const tagline = locale === 'ar' ? product.taglineAr : product.taglineEn;
  const isDiscounted = product.discountActive && product.discountPercent > 0;
  const effectivePrice = isDiscounted
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <article className={styles.card}>
      {/* Product Image + Badges */}
      <Link href={`/products/${product.id}`} className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.productImage}
          priority={product.id === 'oud-royale'}
        />

        {isDiscounted && (
          <span className={styles.discountBadge}>
            {t('discountBadge', { percent: product.discountPercent })}
          </span>
        )}

        <span className={styles.concentrationTag}>
          {product.size}
        </span>
      </Link>

      {/* Product Information */}
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.name}>
            <Link href={`/products/${product.id}`}>{name}</Link>
          </h3>
        </div>

        <p className={styles.character}>{tagline}</p>

        {/* Pricing */}
        <div className={styles.priceWrapper}>
          <span className={styles.currentPrice}>
            {effectivePrice} {common('currency')}
          </span>
          {isDiscounted && (
            <span className={styles.originalPrice}>
              {product.price} {common('currency')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link href={`/products/${product.id}`}>
            <Button variant="secondary" size="sm" fullWidth>
              {common('viewDetails')}
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => addToCart(product, 1)}
          >
            {common('addToCart')}
          </Button>
        </div>
      </div>
    </article>
  );
}
