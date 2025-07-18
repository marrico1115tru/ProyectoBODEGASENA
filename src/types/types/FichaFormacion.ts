import { ReactNode } from "react";

export interface Titulado {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido?: string;
}

export interface FichaFormacion {
  codigo: ReactNode;
  id: number;
  nombre: string | null;
  idTitulado: Titulado;
  idUsuarioResponsable: Usuario | null;
}
