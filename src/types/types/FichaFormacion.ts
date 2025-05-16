export interface FichaFormacion {
  id?: number;
  nombre: string;
  tituloId: number;
  fechaInicial: string; // formato ISO
  fechaFinal: string;   // formato ISO
}
