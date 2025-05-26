export interface Area {
  id: number;
  nombre: string;
  descripcion: string;
  fechaCreacion: string; // formato ISO
}

export type AreaForm = Partial<Omit<Area, "id">>;
