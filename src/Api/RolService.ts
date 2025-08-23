import axios from 'axios';
import { Rol, RolFormValues } from '@/types/types/Rol';

const API_URL = 'http://localhost:3000/roles';

const config = {
  withCredentials: true,
};

export const getRoles = async (): Promise<Rol[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createRol = async (data: RolFormValues): Promise<Rol> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateRol = async (
  id: number,
  data: RolFormValues
): Promise<Rol> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteRol = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
