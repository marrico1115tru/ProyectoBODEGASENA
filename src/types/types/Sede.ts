export interface Sede {
  id: number;
  nombre: string;
  ubicacion: string;
  areaId: number;
  centroId: number;
  fechaInicial: string; // ISO string
  fechaFinal: string;   // ISO string
}
