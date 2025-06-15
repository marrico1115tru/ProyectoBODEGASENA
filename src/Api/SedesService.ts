import axios from 'axios';
import { Sede, SedeFormValues } from '@/types/types/Sede';

const API_URL = 'http://localhost:3000/sedes';

export const getSedes = async (): Promise<Sede[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createSede = async (data: SedeFormValues): Promise<Sede> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateSede = async (id: number, data: SedeFormValues): Promise<Sede> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteSede = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
