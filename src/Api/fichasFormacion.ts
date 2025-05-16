import axios from 'axios';

export interface CentroFormacion {
  id?: number;               // id opcional para crear
  nombre: string;
  ubicacion: string;
  telefono: string;
  email: string;
  fechaInicial: string;      // ISO string para fecha
  fechaFinal: string;        // ISO string para fecha
  // Puedes agregar más campos si los necesitas
}

const API_URL = 'http://localhost:3500/api/centros-formacion';

export const getCentrosFormacion = async (): Promise<CentroFormacion[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createCentroFormacion = async (centro: CentroFormacion): Promise<CentroFormacion> => {
  const response = await axios.post(API_URL, centro);
  return response.data;
};

export const updateCentroFormacion = async (id: number, centro: CentroFormacion): Promise<CentroFormacion> => {
  const response = await axios.put(`${API_URL}/${id}`, centro);
  return response.data;
};

export const deleteCentroFormacion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
