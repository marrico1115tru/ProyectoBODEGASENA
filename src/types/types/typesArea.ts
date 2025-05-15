// src/types/typesArea.ts
export interface Area {
  id?: number;  // Opcional al crear
  nombre: string;
  centroFormacionId: number;
  sitioId: number;
  fechaInicial?: string;  // ISO string
  fechaFinal?: string;    // ISO string
}
