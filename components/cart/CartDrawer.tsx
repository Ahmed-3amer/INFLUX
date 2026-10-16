'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/lib/cart-context';
import { calculateEffectivePrice } from '@/types';
import Button from '@/components/ui/Button';
import { X, Plus, Minus, Trash2, Sparkles } from 'lucide-react';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const t = useTranslations('cartDrawer');
  const common = useTranslations('common');
  const locale = useLocale();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    total,
    itemsCount,
  } = useCart();

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={styles.overlay}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <span>{t('title')}</span>
            <span className={styles.countBadge}>
              ({itemsCount} {common('items')})
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className={styles.closeButton}
            aria-label={common('close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Complimentary discovery vial notice */}
        <div className={styles.sampleBanner}>
          <Sparkles size={14} />
          <span>{t('sampleNotice')}</span>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>{t('emptyTitle')}</p>
            <p className={styles.emptySubtitle}>{t('emptySubtitle')}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={closeDrawer}
            >
              {t('startShopping')}
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {items.map(({ product, quantity }) => {
                const name = locale === 'ar' ? product.nameAr : product.nameEn;
                const effectivePrice = calculateEffectivePrice(product);

                return (
                  <div key={product.id} className={styles.itemCard}>
                    <div className={styles.itemImageWrapper}>
                      <Image
                        src={product.image || '/images/brand/Logo0.png'}
                        alt={name}
                        fill
                        sizes="80px"
                        className={styles.itemImage}
                      />
                    </div>

                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{name}</h4>
                      <span className={styles.itemMeta}>
                        {product.concentration} • {product.size}
                      </span>
                      <span className={styles.itemPrice}>
                        {effectivePrice} {common('currency')}
                      </span>

                      <div className={styles.qtyControls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyNum}>{quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`${common('remove')} ${name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & Checkout Button */}
            <div className={styles.footer}>
              <div className={styles.summaryRow}>
                <span>{common('subtotal')}</span>
                <span>{subtotal} {common('currency')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>{common('shipping')}</span>
                <span className={styles.freeShipping}>{common('free')}</span>
              </div>
              <div className={styles.totalRow}>
                <span>{common('total')}</span>
                <span>{total} {common('currency')}</span>
              </div>

              <Link href="/checkout" onClick={closeDrawer} style={{ display: 'block', width: '100%' }}>
                <Button variant="burgundy" fullWidth size="lg">
                  {t('checkout')}
                </Button>
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
