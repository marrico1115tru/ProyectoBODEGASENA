
export interface CentroFormacion {
  id: number;
  nombre: string;
  ubicacion: string;
  telefono: string;
  fecha_registro: string;
}

export const fetchCentrosFormacion = async (): Promise<CentroFormacion[]> => {
  try {
    const response = await fetch('http://localhost:3500/API/CentroFormacion');
    if (!response.ok) {
      throw new Error('Error al obtener los centros de formación');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
