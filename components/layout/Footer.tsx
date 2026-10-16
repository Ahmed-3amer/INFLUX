'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          {/* Brand info */}
          <div className={styles.brandCol}>
            <Image
              src="/images/brand/Logo1.png"
              alt="INFLUX Haute Parfumerie"
              width={130}
              height={36}
              className={styles.footerLogo}
            />
            <p className={styles.brandDesc}>{t('brandDesc')}</p>
            <span className={styles.notice}>{t('quietLuxuryNotice')}</span>
          </div>

          {/* Customer Quick Links (No admin links) */}
          <div>
            <h4 className={styles.colTitle}>{t('quickLinks')}</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link href="/">{nav('home')}</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/#collection">{nav('collection')}</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/about">{nav('about')}</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className={styles.colTitle}>{t('support')}</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <span>{t('shippingReturns')}</span>
              </li>
              <li className={styles.linkItem}>
                <Link href="/about">{nav('contact')}</Link>
              </li>
              <li className={styles.linkItem}>
                <span>القاهرة، مصر (Cairo, Egypt)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div>{t('rights')}</div>
          <div className={styles.legalLinks}>
            <span>{t('privacy')}</span>
            <span>•</span>
            <span>{t('terms')}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
