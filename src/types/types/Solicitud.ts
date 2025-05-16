export interface Solicitud {
  id?: number;         // opcional para crear
  productoId: number;
  cantidad: number;
  usuarioId: number;
  fechaSolicitud: string;  // ISO string
  estado?: string;
}
