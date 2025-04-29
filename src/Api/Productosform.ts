import {z} from 'zod';

const API_URL = 'http://localhost:3500/API/Productos';

// Definimos el tipo Producto
export interface Producto {
  id: number;
  codigo_sena: string;
  unspc: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  tipo_material: string;
  id_area: number;
  id_categoria: number;
  fecha_caducidad: string; // Puede ser Date si lo conviertes luego
}

// Obtener todos los productos
export const fetchProductos = async (): Promise<Producto[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    const data = await response.json();
    return data as Producto[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProducto = async (
  producto: Omit<Producto, 'id'>
): Promise<Producto> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }

    const data = await response.json();
    return data as Producto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Actualizar un producto existente
export const updateProducto = async (
  id: number,
  producto: Partial<Omit<Producto, 'id'>>
): Promise<Producto> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el producto');
    }

    const data = await response.json();
    return data as Producto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const productoSchema = z.object({
 
  codigo_sena: z.string().min(1, "El código SENA es obligatorio."),
  unspc: z.string().optional(), // No estaba en tu formulario, así que puede ser opcional
  nombre: z.string().min(1, "El nombre es obligatorio."),
  descripcion: z.string().min(1, "La descripción es obligatoria."),
  cantidad: z.number().int().nonnegative(), // entero >= 0
  unidad_medida: z.string().min(1, "La unidad de medida es obligatoria."),
  tipo_material: z.string().min(1, "El tipo de material es obligatorio."),
  id_area: z.number().int().positive(),
  id_categoria: z.number().int().positive(),
  fecha_caducidad: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "La fecha de caducidad debe tener el formato YYYY-MM-DD."
  ),
});

// Eliminar un producto
export default async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
