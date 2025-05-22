export interface Sede {
  id: number;
  nombre: string;
  ubicacion: string;
  fechaCreacion: string;
  fechaFinalizacion?: string | null;
  idCentroFormacion: number;
  centroFormacion?: {
    id: number;
    nombre: string;
    ubicacion: string;
    telefono: string;
    email: string;
    fechaCreacion: string;
    fechaFinalizacion: string | null;
  };
}
