import type { Metadata } from 'next';

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
        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">1. Qué datos recopilamos</h2>
          <p className="mb-3">
            Cuando utilizás la función de reserva por WhatsApp de este sitio, el mensaje que se
            genera puede incluir:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-ink-700">
            <li>
              Tu número de teléfono de WhatsApp (proporcionado por la plataforma de mensajería).
            </li>
            <li>Tu nombre, si lo incluís en el mensaje.</li>
            <li>La lista de productos que seleccionaste en el sitio.</li>
          </ul>
          <p className="mt-3">
            No recopilamos datos de tarjetas de crédito, contraseñas ni información sensible de
            salud a través de este sitio.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">
            2. Para qué usamos tus datos
          </h2>
          <p className="mb-3">Los datos se usan exclusivamente para:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-ink-700">
            <li>Procesar tu consulta o reserva de productos.</li>
            <li>
              Enviarte notificaciones sobre el estado de tu pedido mediante WhatsApp, a través de la
              API de WhatsApp Business de Meta.
            </li>
            <li>
              Responderte consultas relacionadas con los productos o servicios de la farmacia.
            </li>
          </ul>
          <p className="mt-3">
            No usamos tus datos para publicidad de terceros ni los vendemos a ninguna empresa.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">
            3. Con quién compartimos tus datos
          </h2>
          <p>
            Para enviar mensajes por WhatsApp utilizamos la{' '}
            <strong className="font-semibold text-ink-900">WhatsApp Business API</strong>, operada
            por Meta Platforms, Inc. Esto implica que los mensajes pasan por la infraestructura de
            Meta sujeta a su propia política de privacidad:{' '}
            <a
              href="https://www.whatsapp.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              whatsapp.com/legal/privacy-policy
            </a>
            .
          </p>
          <p className="mt-3">No compartimos tus datos con ningún otro tercero.</p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">
            4. Cuánto tiempo guardamos tus datos
          </h2>
          <p>
            Los datos asociados a tu pedido se conservan mientras el pedido esté activo o hasta que
            solicités su eliminación. No almacenamos historiales de conversaciones de WhatsApp más
            allá del ciclo de vida del pedido.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">5. Tus derechos</h2>
          <p>
            Tenés derecho a acceder, corregir o eliminar los datos que tengamos sobre vos. Para
            ejercerlos, escribinos por WhatsApp al{' '}
            <a
              href="https://wa.me/5491178942852"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              +54 11 7894 2852
            </a>{' '}
            o llamanos al mismo número.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">6. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política ocasionalmente. La fecha de última actualización
            siempre aparecerá al inicio de esta página.
          </p>
        </section>

        <section className="border-t border-line pt-8">
          <h2 className="mb-3 text-base font-semibold text-ink-900">7. Contacto</h2>
          <address className="space-y-1 text-ink-700 not-italic">
            <p className="font-medium text-ink-900">Farmacia Duret</p>
            <p>E. Casella 1743, Villa Rosa, Pilar del Este</p>
            <p>Buenos Aires, Argentina</p>
            <a
              href="tel:+541178942852"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              +54 11 7894 2852
            </a>
          </address>
        </section>
      </div>
    </main>
  );
}
