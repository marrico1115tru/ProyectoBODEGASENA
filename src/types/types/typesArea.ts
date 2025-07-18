export interface Area {
  id: number;
  nombreArea: string | null;
  idSede: {
    id: number;
    nombre: string | null;
  };
}

export interface AreaFormValues {
  nombreArea: string;
  idSede: {
    id: number;
  };
}
