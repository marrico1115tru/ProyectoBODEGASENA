export interface Permiso {
  id: number;
  idRol: number;
  idOpcion: number;
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
}

export interface Opcion {
  id: number;
  nombreOpcion: string;
  descripcion: string;
  rutaFrontend: string;
}

export interface Modulo {
  id: number;
  nombreModulo: string;
  opciones: Opcion[];
}

export interface Rol {
  id: number;
  nombreRol: string;
}
