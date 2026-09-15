import type { scanImage } from './scan';

export type ScanResult = Awaited<ReturnType<typeof scanImage>>;
export type ScanStatus = 'idle' | 'loading' | 'success' | 'error';
