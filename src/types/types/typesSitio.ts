export interface TipoSitio {
  id: number;
  nombre: string;
}

export interface Sitio {
  id: number;
  nombre: string;
  ubicacion: string;
  tipoSitioId: number;
  tipoSitio: TipoSitio;
  fechaInicial: string;
  fechaFinal: string;
  activo: boolean;
}
