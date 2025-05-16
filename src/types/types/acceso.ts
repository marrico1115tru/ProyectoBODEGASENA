export interface Acceso {
  id: number;
  opcionId: number;
  rolId: number;
  opcion?: {
    id: number;
    nombre: string;
  };
  rol?: {
    id: number;
    nombreRol: string;
  };
}
