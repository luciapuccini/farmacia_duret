import { SITE_URL } from '@/config/site';

export const description =
  'Dirección, teléfono, horarios y preguntas frecuentes de Farmacia Duret en Villa Rosa, Pilar del Este.';

export const googleMapsUrl =
  'https://www.google.com/maps/place/Farmacia+Duret/@-34.4064716,-58.8588412,17z/data=!3m1!4b1!4m6!3m5!1s0x95bc9dc88cd56f9d:0x2f17665d565396da!8m2!3d-34.4064761!4d-58.8562663!16s%2Fg%2F11xkrnpz6y?entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D';

export const googleMapsEmbedUrl =
  'https://www.google.com/maps?q=Farmacia%20Duret%2C%20E.%20Casella%201743%2C%20Villa%20Rosa%2C%20Buenos%20Aires&z=16&output=embed';

export const pharmacyPhone = '+541178942852';
export const pharmacyInstagram = 'https://www.instagram.com/farmacia_duret';
export const pharmacyWhatsApp = 'https://wa.me/5491178942852';

export const pharmacyJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Pharmacy',
  '@id': `${SITE_URL}/contact#pharmacy`,
  name: 'Farmacia Duret',
  url: SITE_URL,
  telephone: pharmacyPhone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'E. Casella 1743',
    addressLocality: 'Villa Rosa',
    addressRegion: 'Buenos Aires',
    postalCode: 'B1631',
    addressCountry: 'AR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -34.4064761,
    longitude: -58.8562663,
  },
  hasMap: googleMapsUrl,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  sameAs: [pharmacyInstagram, pharmacyWhatsApp, googleMapsUrl],
};

export const faqs = [
  {
    question: '¿Dónde está ubicada Farmacia Duret?',
    answer:
      'Farmacia Duret está en Pilar del Este, E. Casella 1743, Villa Rosa, Provincia de Buenos Aires.',
  },
  {
    question: '¿Cuál es el horario de atención?',
    answer:
      'Atendemos de lunes a sábado de 8:00 a 20:00. Los domingos la farmacia permanece cerrada.',
  },
  {
    question: '¿Puedo ver productos del catálogo online?',
    answer:
      'Sí. Podés explorar categorías como dermocosmética, belleza o cuidado personal desde el menú. Elegí los productos que te interesen y consultanos por WhatsApp para confirmar stock y precio.',
  },
  {
    question: '¿Puedo consultar disponibilidad de productos antes de ir?',
    answer:
      'Sí. Podés explorar el catálogo online, comunicarte por teléfono o armar un encargo por WhatsApp para consultar disponibilidad de medicamentos, productos de farmacia, dermocosmética, cuidado personal y ofertas.',
  },
  {
    question: '¿Puedo hacer un pedido por WhatsApp?',
    answer:
      'Sí. Podés armar un encargo desde Encargos o elegir productos del catálogo online (hasta 5) y enviarlos por WhatsApp desde el carrito. En ambos casos, la farmacia te confirma disponibilidad y precio.',
  },
  {
    question: '¿Venden medicamentos con receta?',
    answer:
      'Sí. Para medicamentos que requieren receta, acercate a la farmacia o consultá previamente para confirmar los requisitos y la disponibilidad.',
  },
  {
    question: '¿La información del sitio reemplaza una consulta médica?',
    answer:
      'No. La información del sitio es orientativa. Para indicaciones de uso, tratamientos o dudas de salud, consultá con un profesional de la salud o con el equipo de la farmacia.',
  },
];

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};
