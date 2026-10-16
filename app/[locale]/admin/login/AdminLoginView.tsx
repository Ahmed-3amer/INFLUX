'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Button from '@/components/ui/Button';
import { Lock, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import styles from './AdminLogin.module.css';

export default function AdminLoginView() {
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === 'ar';

  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('influx_admin_preview_auth', 'true');
        router.push('/admin/dashboard');
      } else {
        setError(
          isAr
            ? 'مفتاح المعاينة غير صحيح (جرب: owner-preview)'
            : 'Invalid preview key (try: owner-preview)'
        );
      }
    } catch {
      setError(isAr ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreview = () => {
    sessionStorage.setItem('influx_admin_preview_auth', 'true');
    router.push('/admin/dashboard');
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.iconWrapper}>
          <Lock size={32} color="var(--accent-burgundy)" />
        </div>

        <h1 className={styles.loginTitle}>
          {isAr ? 'دخول مالك المتجر' : 'Store Owner Portal'}
        </h1>
        <p className={styles.loginSubtitle}>
          {isAr
            ? 'منظومة إدارة المنتجات وتعديل الأسعار والعروض الترويجية'
            : 'Catalog, pricing, and promotional discount administration'}
        </p>

        {/* Prominent Development Security Notice */}
        <div className={styles.devNoticeBox}>
          <div className={styles.devNoticeTitle}>
            <Info size={16} />
            <span>
              {isAr ? 'تنبيه مرحلة التطوير والمعاينة' : 'Development Preview Notice'}
            </span>
          </div>
          <p>
            {isAr
              ? 'هذه الشاشة مخصصة لمعاينة واجهة إدارة المالك فقط قبل ربط قاعدة بيانات Supabase. في الإنتاج، سيتم التحقق من الحساب حصرياً عبر خادم Supabase Auth وسيتم تفعيل سياسات حماية البيانات (Row Level Security).'
              : 'This interface is for local store-owner workflow preview prior to Supabase connection. In production, single-owner access will be enforced via Supabase Auth and server-side database Row Level Security.'}
          </p>
        </div>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <input
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder={isAr ? 'أدخل مفتاح المعاينة (owner-preview)' : 'Enter preview key (owner-preview)'}
            className={styles.inputField}
          />

          <Button type="submit" variant="burgundy" fullWidth size="lg" disabled={loading}>
            {loading
              ? (isAr ? 'جاري التحقق...' : 'Verifying...')
              : (isAr ? 'دخول لوحة التحكم' : 'Enter Management Portal')}
          </Button>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            size="md"
            onClick={handleQuickPreview}
          >
            {isAr ? (
              <>
                <span>معاينة فورية بدون كلمة مرور (Dev Access)</span>
                <ArrowLeft size={14} style={{ marginInlineStart: 6 }} />
              </>
            ) : (
              <>
                <span>Instant Developer Preview Access</span>
                <ArrowRight size={14} style={{ marginInlineStart: 6 }} />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
