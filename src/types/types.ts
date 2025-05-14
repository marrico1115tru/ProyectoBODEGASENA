export interface Producto {
  id?: number; 
  codigoSena: string;
  unspc?: string;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  categoria: string;
  tipoMateria: string;
  fechaVencimiento?: string; 
  areaId: number;
  fechaInicial?: string; 
  fechaFinal?: string;  
}
