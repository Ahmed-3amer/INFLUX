import React from 'react';
import AdminHeader from './AdminHeader';
import styles from './AdminLayout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminWrapper}>
      <AdminHeader />
      <main className={styles.adminMain}>{children}</main>
      <footer className={styles.adminFooter}>
        <span>INFLUX Maison Haute Parfumerie — Single Store-Owner Administration (Development Preview)</span>
      </footer>
    </div>
  );
}
