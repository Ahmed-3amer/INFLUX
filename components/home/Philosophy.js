'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import styles from './Philosophy.module.css';

export default function Philosophy() {
  const t = useTranslations('philosophy');
  const about = useTranslations('about');

  const pillars = [
    {
      num: '01',
      title: about('val1Title'),
      desc: about('val1Desc'),
    },
    {
      num: '02',
      title: about('val2Title'),
      desc: about('val2Desc'),
    },
    {
      num: '03',
      title: about('val3Title'),
      desc: about('val3Desc'),
    },
  ];

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.inner}>
          <span className={styles.tag}>{t('tag')}</span>
          <h2 className={styles.title}>{t('title')}</h2>

          <div className={styles.textBlock}>
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
          </div>

          <div className={styles.pillarsGrid}>
            {pillars.map((pillar) => (
              <div key={pillar.num} className={styles.pillarCard}>
                <span className={styles.pillarNum}>{pillar.num}</span>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDesc}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
