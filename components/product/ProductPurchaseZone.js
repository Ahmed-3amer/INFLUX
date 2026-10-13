'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/lib/cart-context';
import Button from '@/components/ui/Button';
import { Plus, Minus, ShieldCheck, Truck, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ProductPurchaseZone.module.css';

export default function ProductPurchaseZone({ product }) {
  const t = useTranslations('products');
  const common = useTranslations('common');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isAr = locale === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;
  const tagline = isAr ? product.taglineAr : product.taglineEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;
  const scentCharacter = isAr ? product.scentCharacterAr : product.scentCharacterEn;

  const isDiscounted = product.discountActive && product.discountPercent > 0;
  const effectivePrice = isDiscounted
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className={styles.wrapper}>
      {/* Visual / Gallery */}
      <div className={styles.galleryCol}>
        <div className={styles.imageFrame}>
          <Image
            src={product.image}
            alt={name}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
            className={styles.mainImage}
            priority
          />

          {isDiscounted && (
            <span className={styles.discountBadge}>
              {t('discountBadge', { percent: product.discountPercent })}
            </span>
          )}
        </div>
      </div>

      {/* Details & Purchase controls */}
      <div className={styles.infoCol}>
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <Link href="/">{nav('home')}</Link>
          <span>/</span>
          <Link href="/#collection">{nav('collection')}</Link>
          <span>/</span>
          <span>{name}</span>
        </div>

        <span className={styles.profileTag}>{scentCharacter}</span>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.tagline}>{tagline}</p>

        {/* Pricing */}
        <div className={styles.priceBox}>
          <span className={styles.price}>
            {effectivePrice} {common('currency')}
          </span>
          {isDiscounted && (
            <span className={styles.originalPrice}>
              {product.price} {common('currency')}
            </span>
          )}
        </div>

        {/* Technical Specs */}
        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>{t('concentration')}</span>
            <span className={styles.specValue}>{product.concentration}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>{t('size')}</span>
            <span className={styles.specValue}>{product.size}</span>
          </div>
        </div>

        {/* Description */}
        <p className={styles.description}>{description}</p>

        {/* Purchase Controls */}
        <div className={styles.purchaseControls}>
          <div className={styles.qtyBox}>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className={styles.qtyDisplay}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className={styles.ctaWrapper}>
            <Button
              variant="burgundy"
              fullWidth
              size="lg"
              onClick={handleAddToCart}
            >
              {common('addToCart')}
            </Button>
          </div>
        </div>

        {/* Trust & Guarantee */}
        <div className={styles.trustList}>
          <div className={styles.trustItem}>
            <Sparkles size={18} className={styles.trustIcon} />
            <span>{t('sampleOffer')}</span>
          </div>
          <div className={styles.trustItem}>
            <Truck size={18} className={styles.trustIcon} />
            <span>{t('shippingNotice')}</span>
          </div>
          <div className={styles.trustItem}>
            <ShieldCheck size={18} className={styles.trustIcon} />
            <span>منتج أصلي ١٠٠٪ مقطر ومصنع تحت إشراف الدار</span>
          </div>
        </div>
      </div>
    </div>
  );
}
