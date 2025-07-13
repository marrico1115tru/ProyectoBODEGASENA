import { CentroFormacion } from './typesCentroFormacion';

export interface Sede {
  id: number;
  nombre: string | null;
  ubicacion: string | null;
  idCentroFormacion: CentroFormacion;
}

export interface SedeFormValues {
  nombre: string;
  ubicacion: string;
  idCentroFormacion: {
    id: number;
  };
}
