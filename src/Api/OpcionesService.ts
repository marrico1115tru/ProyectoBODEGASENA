import axios from 'axios';
import { Opcion } from '@/types/types/Opcion';

const API_URL = 'http://localhost:3500/api/opciones';

export const getOpciones = async (): Promise<Opcion[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createOpcion = async (opcion: Opcion): Promise<Opcion> => {
  const response = await axios.post(API_URL, opcion);
  return response.data;
};

export const updateOpcion = async (id: number, opcion: Opcion): Promise<Opcion> => {
  const response = await axios.put(`${API_URL}/${id}`, opcion);
  return response.data;
};

export const deleteOpcion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
