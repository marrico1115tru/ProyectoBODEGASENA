export interface Rol {
  id: number;
  nombreRol: string;
}

export interface Area {
  id: number;
  nombreArea: string;
}

export interface Titulado {
  id: number;
  nombre: string | null;
}

export interface FichaFormacion {
  id: number;
  nombre: string;
  idTitulado: Titulado; // Relación con titulado
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string | null;
  cedula: string | null;
  email: string | null;
  telefono: string | null;
  cargo: string | null;
  idArea: Area;
  idFichaFormacion: FichaFormacion;
  idRol: Rol;
}
