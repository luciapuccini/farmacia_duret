import AttentionCard from '@/app/(home)/components/AttentionCard/AttentionCard';
import ClientsCard from '@/app/(home)/components/ClientsCard/ClientsCard';
import HeroPhoto from '@/app/(home)/components/HeroPhoto/HeroPhoto';
import SameDayBadge from '@/app/(home)/components/SameDayBadge/SameDayBadge';
import styles from './HeroVisual.module.scss';

export default function HeroVisual() {
  return (
    <div className={styles.visual}>
      <HeroPhoto />
      <AttentionCard />
      <ClientsCard />
      <SameDayBadge />
    </div>
  );
}
