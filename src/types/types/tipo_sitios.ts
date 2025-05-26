export interface TipoSitio {
  id: number;
  nombre: string;
  fechaCreacion: string;
  fechaFinalizacion: string | null;
  sitios: any[]; // Puedes tiparlo mejor si sabes la estructura de "sitios"
}
