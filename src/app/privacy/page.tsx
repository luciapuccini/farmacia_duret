import type { Metadata } from 'next';
import { policySections } from './privacy.content';

const description =
  'Política de privacidad de Farmacia Duret: cómo recopilamos, usamos y protegemos tus datos personales.';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Farmacia Duret',
  description,
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Política de Privacidad | Farmacia Duret',
    description,
    url: '/privacy',
    siteName: 'Farmacia Duret',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <main className="">
      <header className="mb-10 border-b border-line pb-8">
        <p className="mb-2 text-sm font-medium tracking-widest text-blue-600 uppercase">
          Farmacia Duret
        </p>
        <h1 className="mb-3 text-3xl font-bold text-ink-900">Política de Privacidad</h1>
        <p className="text-sm text-ink-500">Última actualización: junio de 2026</p>
      </header>

      <div className="space-y-8 leading-relaxed text-ink-700">
        {policySections.map(({ title, className, body }) => (
          <section key={title} className={className}>
            <h2 className="mb-3 text-base font-semibold text-ink-900">{title}</h2>
            {body}
          </section>
        ))}
      </div>
    </main>
  );
}
