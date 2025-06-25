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
  rol: string | null;
  password: string; 
  idArea: Area;
  idFichaFormacion: FichaFormacion;
  idRol: Rol;
}

// Usuario que viene del login (simplificado)
export interface UsuarioLogin {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  permisos: Permiso[];
}

export interface Permiso {
  ruta: string;
  puede_ver: boolean;
  puede_crear: boolean;
  puede_editar: boolean;
  puede_eliminar: boolean;
}
