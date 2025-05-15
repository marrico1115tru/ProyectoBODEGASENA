import axios from 'axios';
import { Sede } from '@/types/types/Sede';

const API_URL = 'http://localhost:3500/api/sedes';

export const getSedes = async (): Promise<Sede[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createSede = async (sede: Sede): Promise<Sede> => {
  const response = await axios.post(API_URL, sede);
  return response.data;
};

export const updateSede = async (id: number, sede: Sede): Promise<Sede> => {
  const response = await axios.put(`${API_URL}/${id}`, sede);
  return response.data;
};

export const deleteSede = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
