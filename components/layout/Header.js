'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const t = useTranslations('nav');
  const common = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { itemsCount, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/#collection', label: t('collection') },
    { href: '/about', label: t('about') },
    { href: '/dashboard', label: t('dashboard') },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Center Logo */}
        <Link href="/" className={styles.logoContainer} aria-label="INFLUX Home">
          {/* Using Logo0.png (burgundy signature on transparent) */}
          <Image
            src="/images/brand/Logo0.png"
            alt="INFLUX Haute Parfumerie"
            width={140}
            height={40}
            className={styles.logoImage}
            priority
          />
        </Link>

        {/* Right Actions */}
        <div className={styles.actions}>
          <button
            onClick={toggleLanguage}
            className={styles.langSwitch}
            aria-label="Switch Language"
          >
            {locale === 'ar' ? 'EN' : 'عربي'}
          </button>

          <button
            onClick={openDrawer}
            className={styles.cartButton}
            aria-label={`${common('cart')} (${itemsCount})`}
          >
            <ShoppingBag size={22} strokeWidth={1.6} />
            {itemsCount > 0 && (
              <span className={styles.cartBadge}>{itemsCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className={styles.mobileMenuOverlay}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={styles.mobileMenuContent}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </header>
  );
}
