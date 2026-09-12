import type { SkinScanResult } from '@/types/types';

export const skinScanResult: SkinScanResult = {
  summary: 'Se observan algunas diferencias de textura en la piel de la foto.',
  visiblePatterns: ['Textura algo irregular en las mejillas.', 'Algo de brillo en la frente.'],
  cosmeticSolutions: [
    {
      name: 'Limpieza suave',
      rationale: 'Una opción sencilla para acompañar el cuidado diario de la piel.',
      precautions: 'Evitá frotar y suspendé el uso si aparece irritación.',
    },
    {
      name: 'Hidratación ligera',
      rationale: 'Puede ayudar a mantener la sensación de confort.',
      precautions: 'Probá primero en una zona pequeña.',
    },
  ],
  medicalCheckFirst: { suggested: false, reason: null },
  disclaimer: 'El análisis de una foto es limitado y no reemplaza una evaluación profesional.',
};
