import { describe, expect, it } from 'vitest';

import { MAX_UPLOAD_BYTES, validateUpload } from '@/app/scan/upload';

describe('Scan upload validation', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'])('accepts %s up to 10 MB', (type) => {
    expect(validateUpload({ type, size: MAX_UPLOAD_BYTES })).toEqual({ ok: true });
  });

  it.each(['image/heic', 'application/pdf', ''])('rejects the unsupported type "%s"', (type) => {
    expect(validateUpload({ type, size: 1024 })).toEqual({
      ok: false,
      reason: 'unsupported_type',
    });
  });

  it('rejects a file over 10 MB', () => {
    expect(validateUpload({ type: 'image/jpeg', size: MAX_UPLOAD_BYTES + 1 })).toEqual({
      ok: false,
      reason: 'too_large',
    });
  });

  it('sets the limit to 10 MB', () => {
    expect(MAX_UPLOAD_BYTES).toBe(10 * 1024 * 1024);
  });
});
