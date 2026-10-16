'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import styles from './AdminLayout.module.css';

export default function AdminHeader() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isAr = locale === 'ar';

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className={styles.adminHeader}>
      <Container>
        <div className={styles.adminHeaderInner}>
          {/* Brand & Management Badge */}
          <div className={styles.brandGroup}>
            <Link href="/" aria-label="INFLUX Storefront">
              <Image
                src="/images/brand/Logo0.png"
                alt="INFLUX Haute Parfumerie"
                width={120}
                height={34}
                priority
              />
            </Link>
            <span className={styles.adminBadge}>
              {isAr ? 'لوحة تحكم المالك' : 'Store Owner Portal'}
            </span>
            <span className={styles.devNoticeBadge}>
              <ShieldCheck size={14} />
              {isAr ? 'معاينة تطويرية' : 'Dev Preview'}
            </span>
          </div>

          {/* Actions */}
          <div className={styles.actionsGroup}>
            <button
              onClick={toggleLanguage}
              className={styles.langBtn}
              aria-label="Switch Language"
            >
              {isAr ? 'EN' : 'عربي'}
            </button>

            <Link href="/">
              <Button variant="secondary" size="sm">
                {isAr ? (
                  <>
                    <span>العودة للمتجر</span>
                    <ArrowLeft size={14} style={{ marginInlineStart: 6 }} />
                  </>
                ) : (
                  <>
                    <span>Storefront</span>
                    <ArrowRight size={14} style={{ marginInlineStart: 6 }} />
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
