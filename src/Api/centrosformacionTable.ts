import axios from 'axios';
import { CentroFormacion } from '@/types/types/typesCentroFormacion';

const apiUrl = 'http://localhost:3500/api/centros-formacion';

export const getCentrosFormacion = async (): Promise<CentroFormacion[]> => {
  const response = await axios.get(apiUrl);
  return response.data;
};

export const createCentroFormacion = async (centro: CentroFormacion): Promise<CentroFormacion> => {
  const response = await axios.post(apiUrl, centro);
  return response.data;
};

export const updateCentroFormacion = async (id: number, centro: CentroFormacion): Promise<CentroFormacion> => {
  const response = await axios.put(`${apiUrl}/${id}`, centro);
  return response.data;
};

export const deleteCentroFormacion = async (id: number): Promise<void> => {
  await axios.delete(`${apiUrl}/${id}`);
};
