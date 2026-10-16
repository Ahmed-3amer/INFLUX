import React from 'react';
import { Barlow, Barlow_Condensed, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LocaleLayoutProps } from '@/types';
import StorefrontChrome from '@/components/layout/StorefrontChrome';
import '../globals.css';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-barlow',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return {
    title: isAr ? 'INFLUX | دار العطور الفاخرة' : 'INFLUX | Haute Parfumerie',
    description: isAr
      ? 'دار عطور مصرية استثنائية تجسد الفخامة الهادئة بتركيزات نقية تدوم طويلاً.'
      : 'Quiet luxury haute perfumery crafted with pure concentrations and lingering depth.',
    icons: {
      icon: '/images/brand/Logo0.png',
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${barlow.variable} ${barlowCondensed.variable} ${ibmPlexArabic.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StorefrontChrome>{children}</StorefrontChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
