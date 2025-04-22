// src/api/bodegas.ts

export interface Bodega {
  id: number;
  nombre: string;
  ubicacion: string | null;
  fecha_registro: string;
}

// Obtener todas las bodegas
export const fetchBodegas = async (): Promise<Bodega[]> => {
  try {
    const response = await fetch('http://localhost:3500/API/Bodega');
    if (!response.ok) {
      throw new Error('Error al obtener las bodegas');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Registrar nueva bodega
export const createBodega = async (bodega: Omit<Bodega, 'id' | 'fecha_registro'>): Promise<Bodega> => {
  try {
    const response = await fetch('http://localhost:3500/API/Bodega', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodega),
    });

    if (!response.ok) {
      throw new Error('Error al crear la bodega');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
