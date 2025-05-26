export interface Area {
  id: number;
  nombreArea: string;
  fechaCreacion: string;           
  fechaFinalizacion: string | null;
  fkSitio: { id: number };
  idCentroFormacion: { id: number };
}
