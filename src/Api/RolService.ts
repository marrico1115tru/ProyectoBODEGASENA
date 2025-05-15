import axios from 'axios';
import { Rol } from '@/types/types/Rol';

const API_URL = 'http://localhost:3500/api/roles';

export const getRoles = async (): Promise<Rol[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createRol = async (rol: Rol): Promise<Rol> => {
  const response = await axios.post(API_URL, rol);
  return response.data;
};

export const updateRol = async (id: number, rol: Rol): Promise<Rol> => {
  const response = await axios.put(`${API_URL}/${id}`, rol);
  return response.data;
};

export const deleteRol = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
