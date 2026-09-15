const AVATARS = [
  { bg: 'var(--bg-blue)', fg: 'var(--blue-600)', letter: 'M' },
  { bg: 'var(--bg-mint)', fg: 'var(--green-700)', letter: 'A' },
  { bg: 'var(--blue-100)', fg: 'var(--blue-700)', letter: 'C' },
];

export default function ClientsCard() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '8%',
        right: '5%',
        background: 'white',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        padding: '14px 18px',
        minWidth: 206,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ display: 'flex' }}>
          {AVATARS.map(({ bg, fg, letter }, i) => (
            <div
              key={letter}
              aria-hidden="true"
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: bg,
                border: '2px solid white',
                fontSize: 11,
                fontWeight: 700,
                color: fg,
                marginLeft: i > 0 ? -8 : 0,
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2 }} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--green-500)">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          ))}
        </div>
      </div>
      <p style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ink-900)', margin: 0 }}>
        +4.800 clientes felices
      </p>
      <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '2px 0 0' }}>
        Valoración media de 4.9 / 5
      </p>
    </div>
  );
}
