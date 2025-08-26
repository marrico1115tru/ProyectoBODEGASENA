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
  fkSitio: Sitio;
  idProducto: Producto;
  movimientos: Movimiento[];
}

// Solo datos del form
export interface InventarioFormValues {
  stock: number;
  fkSitioId: number;
  idProductoId: number;
  placaSena?: string; // nunca null
}

// Para peticiones al backend
export interface InventarioCreatePayload {
  stock: number;
  fkSitioId: number;
  idProductoId: number;
  placaSena?: string;
}

export interface InventarioUpdatePayload {
  stock: number;
  fkSitioId: number;
  idProductoId: number;
  placaSena?: string;
}
