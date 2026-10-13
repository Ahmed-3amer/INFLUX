'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import styles from './Hero.module.css';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.inner}>
          {/* Content Column */}
          <div className={styles.content}>
            <span className={styles.eyebrow}>{t('eyebrow')}</span>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>

            <div className={styles.actions}>
              <a href="#collection">
                <Button variant="primary" size="lg">
                  {t('cta')}
                </Button>
              </a>
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  {t('storyCta')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Column: Brand Emblem PP.png */}
          <div className={styles.visualWrapper}>
            <div className={styles.sealFrame}>
              <Image
                src="/images/brand/PP.png"
                alt="INFLUX Seal of Excellence"
                width={360}
                height={360}
                className={styles.sealImage}
                priority
              />
            </div>
            <div className={styles.accentBadge}>
              Extrait de Parfum
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
