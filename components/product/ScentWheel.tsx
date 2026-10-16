'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Product } from '@/types';
import styles from './ScentWheel.module.css';

export interface ScentWheelProps {
  product: Product;
}

type TierKey = 'top' | 'heart' | 'base';

export default function ScentWheel({ product }: ScentWheelProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const [activeTier, setActiveTier] = useState<TierKey>('heart');

  const isAr = locale === 'ar';
  const topNotes = isAr ? product.topNotesAr : product.topNotesEn;
  const heartNotes = isAr ? product.heartNotesAr : product.heartNotesEn;
  const baseNotes = isAr ? product.baseNotesAr : product.baseNotesEn;

  const tiers: Record<
    TierKey,
    {
      id: TierKey;
      name: string;
      duration: string;
      notes: string[];
      stageTag: string;
    }
  > = {
    top: {
      id: 'top',
      name: t('topNotes'),
      duration: isAr ? 'أول ١٥ إلى ٣٠ دقيقة' : 'Initial 15 - 30 minutes',
      notes: topNotes,
      stageTag: isAr ? 'المرحلة الأولى' : 'Phase I',
    },
    heart: {
      id: 'heart',
      name: t('heartNotes'),
      duration: isAr ? 'من ٣٠ دقيقة حتى ٤ ساعات' : '30 mins - 4 hours',
      notes: heartNotes,
      stageTag: isAr ? 'المرحلة الثانية (الجوهر)' : 'Phase II (Heart)',
    },
    base: {
      id: 'base',
      name: t('baseNotes'),
      duration: isAr ? 'من ٤ ساعات وحتى ١٦+ ساعة' : '4 hours - 16+ hours',
      notes: baseNotes,
      stageTag: isAr ? 'المرحلة الثالثة (الأثر المتبقي)' : 'Phase III (Trail)',
    },
  };

  const current = tiers[activeTier] || tiers.heart;

  return (
    <section className={styles.wrapper} aria-label={t('notes')}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>{t('scentProfile')}</span>
        <h2 className={styles.title}>{t('notes')}</h2>
        <p className={styles.subtitle}>
          {isAr
            ? 'يتنفس العطر على بشرتك عبر ثلاث مراحل زمنية متدرجة، كاشفاً عن طبقاته العطرية بدقة متناهية.'
            : 'The fragrance breathes on your skin through three temporal phases, revealing layered facets over time.'}
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tierTabs}>
        <button
          className={`${styles.tierBtn} ${activeTier === 'top' ? styles.active : ''}`}
          onClick={() => setActiveTier('top')}
        >
          {t('topNotes')}
        </button>
        <button
          className={`${styles.tierBtn} ${activeTier === 'heart' ? styles.active : ''}`}
          onClick={() => setActiveTier('heart')}
        >
          {t('heartNotes')}
        </button>
        <button
          className={`${styles.tierBtn} ${activeTier === 'base' ? styles.active : ''}`}
          onClick={() => setActiveTier('base')}
        >
          {t('baseNotes')}
        </button>
      </div>

      {/* Interactive Showcase */}
      <div className={styles.showcaseCard}>
        <div className={styles.stageInfo}>
          <span className={styles.stageTag}>{current.stageTag}</span>
          <h3 className={styles.stageName}>{current.name}</h3>
          <span className={styles.stageDuration}>{current.duration}</span>
        </div>

        <div className={styles.notesGrid}>
          {current.notes.map((note, index) => (
            <span key={index} className={styles.notePill}>
              <span className={styles.noteDot} />
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Complete Three-Tier Comparison */}
      <div className={styles.fullBreakdown}>
        <div className={styles.column}>
          <div className={styles.colHeader}>
            <span>{tiers.top.name}</span>
            <span className={styles.colDuration}>{tiers.top.duration}</span>
          </div>
          <ul className={styles.colList}>
            {tiers.top.notes.map((note, i) => (
              <li key={i} className={styles.colItem}>{note}</li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <div className={styles.colHeader}>
            <span>{tiers.heart.name}</span>
            <span className={styles.colDuration}>{tiers.heart.duration}</span>
          </div>
          <ul className={styles.colList}>
            {tiers.heart.notes.map((note, i) => (
              <li key={i} className={styles.colItem}>{note}</li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <div className={styles.colHeader}>
            <span>{tiers.base.name}</span>
            <span className={styles.colDuration}>{tiers.base.duration}</span>
          </div>
          <ul className={styles.colList}>
            {tiers.base.notes.map((note, i) => (
              <li key={i} className={styles.colItem}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
