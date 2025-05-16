// src/types/CentroFormacion.ts
export interface CentroFormacion {
  id?: number; // opcional para cuando crees uno nuevo
  nombre: string;
  ubicacion: string;
  telefono: string;
  email: string;
  fechaInicial: string; // ISO date string
  fechaFinal: string;   // ISO date string
  // Si quieres incluir relaciones, puedes agregar opcionales así:
  // Sede?: Sede[];
  // areas?: Area[];
  // municipios?: Municipio[];
}
