export interface CentroFormacion {
  id: number;
  nombre: string;
}

export interface Municipio {
  id: number;
  nombre: string;
  departamento: string;
  fechaCreacion: string;
  estado: boolean;
  centroformacions: CentroFormacion[];
}
