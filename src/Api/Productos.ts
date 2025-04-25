const API_URL = 'http://localhost:3500/API/Productos';

// Obtener todos los productos
export const fetchProductos = async (): Promise<Producto[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Crea productos
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

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Actualiza un producto
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

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Elimina un producto
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
