import React from 'react';
import styles from './SectionHeading.module.css';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = ''
}) {
  return (
    <div className={`${styles.wrapper} ${styles[align] || styles.center} ${className}`}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
