// api/entregaMaterial.ts
import axios from 'axios';
import { EntregaMaterial } from '@/types/types/EntregaMaterial';

const API_URL = 'http://localhost:3500/api/entregaMaterial';

export const getEntregas = async (): Promise<EntregaMaterial[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getEntrega = async (id: number): Promise<EntregaMaterial> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createEntrega = async (entrega: EntregaMaterial): Promise<EntregaMaterial> => {
  const response = await axios.post(API_URL, entrega);
  return response.data;
};

export const updateEntrega = async (id: number, entrega: EntregaMaterial): Promise<EntregaMaterial> => {
  const response = await axios.put(`${API_URL}/${id}`, entrega);
  return response.data;
};

export const deleteEntrega = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
