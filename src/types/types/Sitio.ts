export interface Sitio {
  id?: number;
  nombre: string;
  ubicacion: string;
  tipoSitioId: number;
  fechaInicial: string;  // ISO string
  fechaFinal: string;    // ISO string
  activo: boolean;
}
