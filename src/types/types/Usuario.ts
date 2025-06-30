export interface Rol {
  id: number;
  nombreRol: string;
}

export interface Area {
  id: number;
  nombreArea: string;
}

export interface FichaFormacion {
  id: number;
  nombre: string;
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

// Opcional: tipo para formularios (sin id)
export type UsuarioFormValues = Omit<Usuario, "id">;
