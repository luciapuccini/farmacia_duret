import Image from "next/image"

export function HeroVisual() {
  return (
    <div className="relative" style={{ aspectRatio: "1.05 / 1" }}>
      {/* Main image container */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <Image
          src="/images/hero-pharmacy.jpg"
          alt="Farmacéutica atendiendo a una madre con su hijo en la farmacia"
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 980px) 100vw, 50vw"
        />

        {/* Soft gradient overlay at bottom for card legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, oklch(0.15 0.03 235 / 0.3) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Floating card — top left: Atención personalizada */}
      <div
        className="absolute flex items-center gap-3"
        style={{
          top: "7%",
          left: "-5%",
          background: "white",
          border: "1px solid var(--color-line)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)",
          padding: "12px 16px",
          minWidth: 200,
        }}
      >
        <div
          className="flex-shrink-0 grid place-items-center"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--color-bg-mint)",
          }}
        >
          {/* Pharmacist icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-green-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13.5, color: "var(--color-ink-900)", margin: 0 }}>
            Atención personalizada
          </p>
          <p style={{ fontSize: 12, color: "var(--color-ink-500)", margin: "2px 0 0" }}>
            Farmacéuticos certificados
          </p>
        </div>
      </div>

      {/* Floating card — bottom right: Clientes satisfechos */}
      <div
        className="absolute"
        style={{
          bottom: "8%",
          right: "-5%",
          background: "white",
          border: "1px solid var(--color-line)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)",
          padding: "14px 18px",
          minWidth: 210,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {[
              { bg: "var(--color-bg-blue)", fg: "var(--color-blue-600)", letter: "M" },
              { bg: "var(--color-bg-mint)", fg: "var(--color-green-700)", letter: "A" },
              { bg: "var(--color-blue-100)", fg: "var(--color-blue-700)", letter: "C" },
            ].map(({ bg, fg, letter }) => (
              <div
                key={letter}
                className="grid place-items-center"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: bg,
                  border: "2px solid white",
                  fontSize: 11,
                  fontWeight: 700,
                  color: fg,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          <div>
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--color-green-500)">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontWeight: 700, fontSize: 13.5, color: "var(--color-ink-900)", margin: 0 }}>
          +4 800 clientes felices
        </p>
        <p style={{ fontSize: 12, color: "var(--color-ink-500)", margin: "2px 0 0" }}>
          Valoración media de 4.9 / 5
        </p>
      </div>

      {/* Floating badge — top right: Envío gratis */}
      <div
        className="absolute flex items-center gap-2"
        style={{
          top: "6%",
          right: "-4%",
          background: "var(--color-bg-mint)",
          border: "1px solid oklch(0.74 0.12 165 / 0.3)",
          borderRadius: "var(--radius-pill)",
          boxShadow: "var(--shadow-sm)",
          padding: "7px 14px",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-green-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4l3 5v3h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--color-green-700)" }}>
          Envío gratis desde 25 €
        </span>
      </div>
    </div>
  )
}
