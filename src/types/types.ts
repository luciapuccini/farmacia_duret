import type { z } from 'zod';
import type {
  ScanEventSchema,
  ScanPhaseSchema,
  SkinScanResultSchema,
} from '@/services/scan/schema';

export type SkinScanResult = z.infer<typeof SkinScanResultSchema>;
export type ScanPhase = z.infer<typeof ScanPhaseSchema>;
export type ScanEvent = z.infer<typeof ScanEventSchema>;

export type TCatalogUrlParams = {
  category: string;
  subcategory?: string;
  filter?: string;
};

export type TFilters = {
  name: string;
  url: string;
};

export type TSubcategory = {
  name: string;
  filters?: TFilters[];
};

export type TCategory = {
  name: string;
  subcategories?: TSubcategory[];
};
