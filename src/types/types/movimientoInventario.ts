export interface MovimientoInventario {
  id?: number;
  productoId: number;
  usuarioId: number;
  tipoMovimiento: 'entrada' | 'salida';
  cantidad: number;
  fechaMovimiento?: string;
  observaciones?: string;
}
