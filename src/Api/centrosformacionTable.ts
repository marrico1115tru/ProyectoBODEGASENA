import axios from 'axios';

export interface CentroFormacion {
  id?: number;
  nombre: string;
  ubicacion: string;
  telefono: string;
  email: string;
  fechaInicial: string; 
  fechaFinal: string;  
}

const API_URL = 'http://localhost:3500/API/CentroFormacion';

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
