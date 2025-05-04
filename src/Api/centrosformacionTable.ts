export interface CentroFormacion {
    id: number;
    nombre: string;
    ubicacion: string;
    telefono?: string;
    fecha_registro: string;
  }
  
  const API_URL = 'http://localhost:3500/API/CentroFormacion'; 
  // Cambia la URL si tu API corre en otro puerto o prefijo
  
  // Obtener todos los centros
  export const fetchCentros = async (): Promise<CentroFormacion[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los centros de formación');
    }
    return await response.json();
  };
  
  // Crear un nuevo centro
  export const createCentro = async (centro: Partial<CentroFormacion>): Promise<void> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(centro),
    });
  
    if (!response.ok) {
      throw new Error('Error al crear el centro de formación');
    }
  };
  
  // Actualizar un centro
  export const updateCentro = async (id: number, centro: Partial<CentroFormacion>): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT', // O PATCH, dependiendo de tu API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(centro),
    });
  
    if (!response.ok) {
      throw new Error('Error al actualizar el centro de formación');
    }
  };
  
  // Eliminar un centro
  export const deleteCentro = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error('Error al eliminar el centro de formación');
    }
  };
  