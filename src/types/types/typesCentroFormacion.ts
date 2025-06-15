export interface CentroFormacion {
  id: number;
  nombre: string | null;
  ubicacion: string | null;
  telefono: string | null;
  email: string | null;
  idMunicipio: {
    id: number;
    nombre: string;
  };
  createdAt?: string;
}

export interface CentroFormacionFormValues {
  nombre: string;
  ubicacion: string;
  telefono: string;
  email: string;
  idMunicipio: {
    id: number;
  };
}
