export interface Titulado {
  id: number;
  nombre: string;
  fechaCreacion: string | null;      // ISO 8601
  fechaFinalizacion: string | null;  // ISO 8601
}
