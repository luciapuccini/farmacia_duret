import { describe, expect, it } from 'vitest';

import { NON_ARGENTINA_PHONE_MESSAGE, PhoneSchema } from '@/utils/phone';

describe('PhoneSchema', () => {
  it('accepts a local Argentina phone number', () => {
    const result = PhoneSchema.safeParse('11 1234-5678');

    expect(result.success).toBe(true);
  });

  it('accepts a full Argentina phone number written with the +54 code', () => {
    const result = PhoneSchema.safeParse('+54 9 11 1234-5678');

    expect(result.success).toBe(true);
  });

  it('rejects an empty phone number', () => {
    const result = PhoneSchema.safeParse('');

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Ingresá un teléfono válido.');
  });

  it.each([
    ['+34 675 512 388', 'Spain'],
    ['+598 99 123 456', 'Uruguay'],
    ['+1 305 555 1234', 'USA'],
  ])('rejects a phone number outside Argentina (%s, %s)', (value) => {
    const result = PhoneSchema.safeParse(value);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(NON_ARGENTINA_PHONE_MESSAGE);
  });
});
