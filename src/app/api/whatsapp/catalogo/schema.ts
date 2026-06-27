import { z } from 'zod';

export const MAX_ITEMS = 5;

// Shared between the basket page (client form validation) and the API route.
export const CatalogoOrderSchema = z.object({
  to: z.string().trim().min(6, 'Ingresá un teléfono válido.'),
  items: z
    .array(z.string())
    .min(1, 'Agregá al menos un producto.')
    .max(MAX_ITEMS, `Podés enviar hasta ${MAX_ITEMS} productos.`),
});

export type CatalogoOrder = z.infer<typeof CatalogoOrderSchema>;
