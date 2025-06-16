export interface CategoriaProducto {
  id: number;
  nombre: string;
  unpsc: string | null;
  productos: { id: number }[];
}

export interface CategoriaProductoFormValues {
  nombre: string;
  unpsc?: string;
}
