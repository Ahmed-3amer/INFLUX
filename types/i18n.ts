import React from 'react';

export type Locale = 'ar' | 'en';

export interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export interface LocalePageProps<T = Record<string, string>> {
  params: Promise<{
    locale: string;
  } & T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}
