// src/types/municipio.ts
export interface Municipio {
  id: number;
  nombre: string;
  departamento: string;
  centroFormacionId: number;
  fechaInicial: string;  // ISO string
  fechaFinal: string;    // ISO string
}
