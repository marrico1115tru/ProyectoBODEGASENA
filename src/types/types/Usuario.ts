export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  cargo: string;
  areaId: number;
  fichaId: number;
  rolId: number;
  fechaInicial?: string;
  fechaFinal?: string;
}
