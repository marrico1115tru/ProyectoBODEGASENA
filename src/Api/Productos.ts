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

// Eliminar un producto
export const deleteProducto = async (id: number): Promise<void> => {
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
