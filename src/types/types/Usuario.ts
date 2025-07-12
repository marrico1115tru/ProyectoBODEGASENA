// Tipo para Área
export interface Area {
  id: number;
  nombreArea: string;
}

// Tipo para Ficha de Formación
export interface FichaFormacion {
  id: number;
  nombre: string;
}

// Tipo para Rol
export interface Rol {
  id: number;
  nombreRol: string;
}

// Tipo principal Usuario (como viene del backend)
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string | null;
  cedula: string | null;
  email: string | null;
  telefono: string | null;
  password: string;
  idArea: Area;
  idFichaFormacion: FichaFormacion;
  rol: Rol | null; // puede ser null según tu ejemplo
  permisos?: never[]; // si usas permisos, define mejor el tipo
}

// Tipo para formularios (sin id y sin password obligatorio)
export type UsuarioFormValues = Omit<Usuario, 'id' | 'permisos'> & {
  password?: string; // opcional, solo para creación o cambio de contraseña
};
