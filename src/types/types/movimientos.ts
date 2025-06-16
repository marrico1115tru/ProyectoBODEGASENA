export interface Movimiento {
  id: number;
  tipoMovimiento: string;
  cantidad: number;
  fechaMovimiento: string;
  idEntrega: number | {
    id: number;
    fechaEntrega?: string;
    observaciones?: string;
  };
  idProductoInventario: number | {
    idProductoInventario: number;
    nombre?: string;
    cantidadDisponible?: number;
  };
}
