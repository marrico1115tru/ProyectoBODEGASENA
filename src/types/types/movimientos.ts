export interface Movimiento {
  id: number;
  tipoMovimiento: string;
  cantidad: number;
  fechaMovimiento: string;
  idEntrega?: {
    id: number;
    fechaEntrega?: string;
    observaciones?: string;
  };
  idProductoInventario: {
    stock: string;
    idProductoInventario: number;
    nombre?: string;
    cantidadDisponible?: number;
  };
}