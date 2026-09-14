import { z } from 'zod';

export const ARGENTINA_DIAL_CODE = '+54';

export const REQUIRED_PHONE_MESSAGE = 'Ingresá un teléfono válido.';
export const NON_ARGENTINA_PHONE_MESSAGE = 'No soportamos telefonos fuera de Argentina';

const NON_ARGENTINA_DIAL_CODE = /^\+(?!54)/;

export const PhoneSchema = z
  .string()
  .trim()
  .min(6, REQUIRED_PHONE_MESSAGE)
  .refine((value) => !NON_ARGENTINA_DIAL_CODE.test(value), NON_ARGENTINA_PHONE_MESSAGE);
