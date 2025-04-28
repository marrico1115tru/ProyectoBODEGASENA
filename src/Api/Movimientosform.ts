export interface MovimientoMaterial {
    id: number;
    tipo: string; // Entrada o Salida
    cantidad: number;
    fecha: string;
    id_producto: number;
    id_usuario: number;
  }
  
  const API_URL = 'http://localhost:3500/API/movimientosmateriales'; // Ajusta tu endpoint
  
  export const fetchMovimientos = async (): Promise<MovimientoMaterial[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener movimientos');
    }
    return await response.json();
  };
  
  export const createMovimiento = async (movimiento: Omit<MovimientoMaterial, 'id'>) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movimiento),
    });
    if (!response.ok) {
      throw new Error('Error al crear movimiento');
    }
    return await response.json();
  };
  
  export const updateMovimiento = async (id: number, movimiento: Partial<MovimientoMaterial>) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movimiento),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar movimiento');
    }
    return await response.json();
  };
  
  export const deleteMovimiento = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar movimiento');
    }
  };
  