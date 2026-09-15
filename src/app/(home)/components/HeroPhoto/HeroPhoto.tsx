import Image from 'next/image';

export default function HeroPhoto() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <Image
        src="/images/hero-pharmacy.jpg"
        alt="Farmacéutica atendiendo a una madre con su hijo en la farmacia"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'top' }}
        sizes="(max-width: 980px) 100vw, 50vw"
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(to top, oklch(0.15 0.03 235 / 0.28) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
