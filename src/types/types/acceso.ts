export interface Opcion {
  id: number;
  nombre: string;
  fechaInicial: string;
  fechaFinal: string;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Acceso {
  id: number;
  opcionId: number;
  rolId: number;
  fechaInicial: string;
  fechaFinal: string;
  opcion?: Opcion;
  rol?: Rol;
}

export interface AccesoInput {
  opcionId: number;
  rolId: number;
  fechaInicial: string;
  fechaFinal: string;
}
