import Image from 'next/image';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LocalePageProps } from '@/types';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import styles from './AboutPage.module.css';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'قصتنا | INFLUX' : 'Our Story | INFLUX',
  };
}

export default async function AboutPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');

  const values = [
    { num: '01', title: t('val1Title'), desc: t('val1Desc') },
    { num: '02', title: t('val2Title'), desc: t('val2Desc') },
    { num: '03', title: t('val3Title'), desc: t('val3Desc') },
  ];

  return (
    <div className={styles.wrapper}>
      <Container>
        {/* Intro Hero */}
        <div className={styles.hero}>
          <span className={styles.eyebrow}>{t('title')}</span>
          <h1 className={styles.title}>{t('subtitle')}</h1>
          <p className={styles.subtitle}>{t('p1')}</p>
        </div>

        {/* Story Grid with PP.png Brand Mark */}
        <div className={styles.storyGrid}>
          <div className={styles.storyVisual}>
            <Image
              src="/images/brand/PP.png"
              alt="INFLUX Maison"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              className={styles.storyImg}
              priority
            />
          </div>

          <div className={styles.storyContent}>
            <h2 className={styles.sectionTitle}>
              {locale === 'ar' ? 'نقاء المكونات وعمق الأثر' : 'Pure Essences, Lingering Depth'}
            </h2>
            <p className={styles.storyParagraph}>{t('p1')}</p>
            <p className={styles.storyParagraph}>{t('p2')}</p>

            <div style={{ marginTop: 'var(--space-4)' }}>
              <Link href="/#collection">
                <Button variant="burgundy" size="lg">
                  {locale === 'ar' ? 'استكشف إبداعات الدار' : 'Explore The Collection'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Pillars / Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.valuesHeading}>
            <h2 className={styles.sectionTitle}>{t('valuesTitle')}</h2>
          </div>

          <div className={styles.valuesGrid}>
            {values.map((val) => (
              <div key={val.num} className={styles.valueCard}>
                <span className={styles.valueIndex}>{val.num}</span>
                <h3 className={styles.valueTitle}>{val.title}</h3>
                <p className={styles.valueDesc}>{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / Concierge Section */}
        <div className={styles.contactBox}>
          <h3 className={styles.contactTitle}>
            {locale === 'ar' ? 'خدمة العملاء والطلب الخاص' : 'Private Concierge & Inquiries'}
          </h3>
          <p className={styles.contactDesc}>
            {locale === 'ar'
              ? 'يسعد فريقنا بتقديم المشورة العطرية ومساعدتك في اختيار عطرك المميز أو ترتيب الهدايا الخاصة.'
              : 'Our perfume concierge is delighted to offer personal guidance in selecting your signature fragrance or arranging bespoke gift boxes.'}
          </p>

          <div className={styles.contactDetails}>
            <span className={styles.contactItem}>concierge@influxperfumes.com</span>
            <span>•</span>
            <span className={styles.contactItem}>+20 100 000 0000</span>
            <span>•</span>
            <span className={styles.contactItem}>Cairo, Egypt</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
