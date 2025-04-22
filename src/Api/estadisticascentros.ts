export interface CentrosFormacion {
  id: number;
  nombre: string;
  ubicacion: string;
  telefono?: string;
  fecha_registro: string;
}

export const obtenerCentrosFormacion = async (): Promise<CentrosFormacion[]> => {
  try {
    const response = await fetch('http://localhost:3500/API/CentroFormacion');
    if (!response.ok) {
      throw new Error('Error al obtener los datos de centros de formación');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la API:', error);
    return [];
  }
};
