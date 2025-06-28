// types/typesArea.ts
export interface SedeRef {
  id: number;
}

export interface Area {
  id: number;
  nombreArea: string;
  idSede: SedeRef;
}

export interface AreaFormValues {
  nombreArea: string;
  idSede: SedeRef;
}
