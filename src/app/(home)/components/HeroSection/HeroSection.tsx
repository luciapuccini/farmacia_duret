import HeroContent from '@/app/(home)/components/HeroContent/HeroContent';
import HeroVisual from '@/app/(home)/components/HeroVisual/HeroVisual';
import styles from '@/app/(home)/home.module.scss';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <HeroContent />

      <div className={styles.heroVisual}>
        <HeroVisual />
      </div>
    </section>
  );
}
