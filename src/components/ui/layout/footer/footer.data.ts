import categories from '@/services/catalog/data/categories.json';
import type { TCategory } from '@/types/types';

export const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/offers', label: 'Ofertas' },
  { href: '/orders', label: 'Encargos' },
  { href: '/contact', label: 'Contacto' },
];

export const legalLinks = [{ href: '/privacy', label: 'Política de privacidad' }];

export const catalogCategories = (categories as TCategory[]).filter(
  (category) => category.subcategories?.length,
);

export const phone = '+541178942852';
export const instagram = 'https://www.instagram.com/farmacia_duret';
export const whatsApp = 'https://wa.me/5491178942852';
