'use client';

import React from 'react';
import { usePathname } from '@/i18n/routing';
import { CartProvider } from '@/lib/cart-context';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';

/**
 * StorefrontChrome Component
 *
 * Separates the customer shopping experience from the admin management portal:
 * - On customer routes: Renders Header, Footer, and CartDrawer wrapped in CartProvider.
 * - On admin routes (/admin, /dashboard): Omits customer chrome completely, allowing
 *   AdminLayout to render an isolated, dedicated administrative portal.
 */
export default function StorefrontChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
