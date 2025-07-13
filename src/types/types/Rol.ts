import { ReactNode } from "react";

export interface Rol {
  nombre: ReactNode;
  id: number;
  nombreRol: string;
}

export interface RolFormValues {
  nombreRol: string;
}
