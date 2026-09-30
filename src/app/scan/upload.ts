export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type UploadRejection = 'unsupported_type' | 'too_large';

export type UploadValidation = { ok: true } | { ok: false; reason: UploadRejection };

/** Shared by the scan page and the scan route, so the upload rules stay the same. */
export function validateUpload(file: { type: string; size: number }): UploadValidation {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { ok: false, reason: 'unsupported_type' };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, reason: 'too_large' };
  }

  return { ok: true };
}
