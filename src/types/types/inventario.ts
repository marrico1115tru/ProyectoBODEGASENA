export interface Sitio {
  id: number;
  nombre: string;
  nombreSitio: string;
  ubicacion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  nombreProducto: string;
  descripcion: string;
  tipoMateria: string;
  fechaVencimiento: string | null;
}

export interface Movimiento {
  id: number;
  tipoMovimiento: string;
  cantidad: number;
  fechaMovimiento: string;
}

export interface Inventario {
  idProductoInventario: number;
  stock: number;
  placaSena?: string;
  fechaEntrada: string;  // ISO date string
  fechaSalida?: string;  // ISO date string or undefined
  fkSitio: Sitio;
  idProducto: Producto;
  movimientos: Movimiento[];
}

// Datos para formularios (frontend)
export interface InventarioFormValues {
  stock: number;
  fkSitioId: number;
  idProductoId: number;
  placaSena?: string;
  fechaEntrada: string;
  fechaSalida?: string;
}

// Payload para creación backend
export interface InventarioCreatePayload {
  stock: number;
  fkSitioId: number;
  idProductoId: number;
  placaSena?: string;
  fechaEntrada: string;
  fechaSalida?: string;
}

// Payload para actualización backend
export interface InventarioUpdatePayload {
  stock?: number;
  fkSitioId?: number;
  idProductoId?: number;
  placaSena?: string;
  fechaEntrada?: string;
  fechaSalida?: string | null;
}
