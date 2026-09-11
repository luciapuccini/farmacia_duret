export default function SameDayBadge() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '7%',
        right: '5%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg-mint)',
        border: '1px solid oklch(0.74 0.12 165 / 0.3)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-sm)',
        padding: '7px 14px',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--green-700)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--green-700)' }}>
        Retirá mismo día
      </span>
    </div>
  );
}
