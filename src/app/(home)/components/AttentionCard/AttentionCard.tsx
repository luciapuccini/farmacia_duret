export default function AttentionCard() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '7%',
        left: '5%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'white',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        padding: '12px 16px',
        minWidth: 196,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'var(--bg-mint)',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--green-700)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink-900)', margin: 0 }}>
          Atención personalizada
        </p>
        <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '2px 0 0' }}>
          Farmacéuticos matriculados
        </p>
      </div>
    </div>
  );
}
