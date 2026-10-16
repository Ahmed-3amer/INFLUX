'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/lib/cart-context';
import { calculateEffectivePrice, CustomerInfo, Order } from '@/types';
import Button from '@/components/ui/Button';
import { CheckCircle2, Truck, Sparkles, MapPin, User } from 'lucide-react';
import styles from './CheckoutForm.module.css';

const EGYPT_GOVERNORATES_AR = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الدقهلية', 'الشرقية',
  'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد',
  'الإسماعيلية', 'السويس', 'البحر الأحمر', 'جنوب سيناء', 'شمال سيناء',
  'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر',
  'أسوان', 'مطروح', 'الوادي الجديد',
];

const EGYPT_GOVERNORATES_EN = [
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Dakahlia', 'Sharqia',
  'Gharbia', 'Monufia', 'Beheira', 'Kafr El Sheikh', 'Damietta', 'Port Said',
  'Ismailia', 'Suez', 'Red Sea', 'South Sinai', 'North Sinai',
  'Fayoum', 'Beni Suef', 'Minya', 'Asyut', 'Sohag', 'Qena', 'Luxor',
  'Aswan', 'Matrouh', 'New Valley',
];

export default function CheckoutForm() {
  const t = useTranslations('checkout');
  const common = useTranslations('common');
  const locale = useLocale();
  const { items, subtotal, total, clearCart } = useCart();

  const isAr = locale === 'ar';
  const governorates = isAr ? EGYPT_GOVERNORATES_AR : EGYPT_GOVERNORATES_EN;

  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    governorate: '',
    city: '',
    street: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.governorate || !formData.street.trim()) {
      setErrorMessage(isAr ? 'يرجى استيفاء الحقول الإلزامية المطلوبة' : 'Please complete all required fields');
      return;
    }

    if (items.length === 0) {
      setErrorMessage(isAr ? 'حقيبة التسوق فارغة' : 'Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: items.map((i) => ({
            id: i.product.id,
            nameAr: i.product.nameAr,
            nameEn: i.product.nameEn,
            quantity: i.quantity,
            price: i.product.price,
            discountPercent: i.product.discountPercent,
            discountActive: i.product.discountActive,
          })),
          total,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      setCompletedOrder(data.order);
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorMessage(isAr ? 'حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة مرة أخرى' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order completed, render success card
  if (completedOrder) {
    return (
      <div className={styles.successCard}>
        <CheckCircle2 size={54} className={styles.successIcon} />
        <h2 className={styles.successTitle}>{t('successTitle')}</h2>
        <div className={styles.orderBadge}>
          {t('orderNumber')}: {completedOrder.orderNumber}
        </div>
        <p className={styles.successDesc}>{t('successSubtitle')}</p>
        <p className={styles.successDesc}>{t('confirmationCall')}</p>

        <Link href="/" style={{ marginTop: 'var(--space-4)' }}>
          <Button variant="primary" size="lg">
            {t('backHome')}
          </Button>
        </Link>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className={styles.successCard}>
        <h2 className={styles.successTitle}>{common('cart')}</h2>
        <p className={styles.successDesc}>
          {isAr
            ? 'حقيبتك فارغة حالياً. تفضل باستكشاف تشكيلتنا العطرية لاختيار عيناتك وزجاجاتك.'
            : 'Your shopping bag is currently empty. Explore our collection to select your fragrance.'}
        </p>
        <Link href="/#collection">
          <Button variant="primary" size="lg">
            {isAr ? 'تصفح المجموعة' : 'Explore Collection'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </div>

      <div className={styles.grid}>
        {/* Left Form */}
        <form onSubmit={handleSubmit} className={styles.formSection}>
          {errorMessage && (
            <div className={styles.errorBanner}>{errorMessage}</div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className={styles.blockTitle}>
              <User size={18} />
              {t('contactInfo')}
            </h3>

            <div className={styles.inputGrid}>
              <div className={styles.field}>
                <label className={styles.label}>
                  {t('name')}
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('namePlaceholder')}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  {t('phone')}
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('phonePlaceholder')}
                  className={styles.input}
                  required
                />
              </div>

              <div className={`${styles.field} ${styles.fullCol}`}>
                <label className={styles.label}>{t('email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder={t('emailPlaceholder')}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div>
            <h3 className={styles.blockTitle}>
              <MapPin size={18} />
              {t('deliveryAddress')}
            </h3>

            <div className={styles.inputGrid}>
              <div className={styles.field}>
                <label className={styles.label}>
                  {t('governorate')}
                  <span className={styles.required}>*</span>
                </label>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                  className={styles.select}
                  required
                >
                  <option value="">{t('selectGovernorate')}</option>
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  {t('city')}
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t('cityPlaceholder')}
                  className={styles.input}
                  required
                />
              </div>

              <div className={`${styles.field} ${styles.fullCol}`}>
                <label className={styles.label}>
                  {t('street')}
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder={t('streetPlaceholder')}
                  className={styles.input}
                  required
                />
              </div>

              <div className={`${styles.field} ${styles.fullCol}`}>
                <label className={styles.label}>{t('notes')}</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  placeholder={t('notesPlaceholder')}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className={styles.blockTitle}>
              <Truck size={18} />
              {t('paymentMethod')}
            </h3>

            <div className={`${styles.paymentCard} ${styles.selected}`}>
              <input
                type="radio"
                name="payment"
                checked
                readOnly
                className={styles.radio}
              />
              <div className={styles.paymentInfo}>
                <span className={styles.paymentTitle}>{t('cod')}</span>
                <span className={styles.paymentDesc}>{t('codDesc')}</span>
              </div>
            </div>

            <div className={`${styles.paymentCard} ${styles.disabled}`}>
              <input
                type="radio"
                name="payment"
                disabled
                className={styles.radio}
              />
              <div className={styles.paymentInfo}>
                <span className={styles.paymentTitle}>{t('card')}</span>
                <span className={styles.paymentDesc}>
                  {isAr ? 'سيتم تفعيل الدفع الإلكتروني قريباً' : 'Online card payments available soon'}
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="burgundy"
            fullWidth
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('submitting') : t('placeOrder')}
          </Button>
        </form>

        {/* Right Summary */}
        <aside className={styles.summaryBox}>
          <h3 className={styles.summaryTitle}>{t('orderSummary')}</h3>

          <div className={styles.itemsList}>
            {items.map(({ product, quantity }) => {
              const name = isAr ? product.nameAr : product.nameEn;
              const effectivePrice = calculateEffectivePrice(product);

              return (
                <div key={product.id} className={styles.itemRow}>
                  <div className={styles.itemThumb}>
                    <Image
                      src={product.image}
                      alt={name}
                      fill
                      sizes="56px"
                      className={styles.itemImg}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{name}</h4>
                    <span className={styles.itemMeta}>
                      {product.size} • ×{quantity}
                    </span>
                  </div>
                  <span className={styles.itemPrice}>
                    {effectivePrice * quantity} {common('currency')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.sampleNote}>
            <Sparkles size={16} />
            <span>عينة تجربة مجانية ٢ مل مشمولة مع كل عبوة</span>
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>{common('subtotal')}</span>
              <span>{subtotal} {common('currency')}</span>
            </div>
            <div className={styles.totalRow}>
              <span>{common('shipping')}</span>
              <span className={styles.freeShipping}>{common('free')}</span>
            </div>
            <div className={styles.grandTotal}>
              <span>{common('total')}</span>
              <span>{total} {common('currency')}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
