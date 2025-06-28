// api/areasApi.ts
import axios from 'axios';
import { Area, AreaFormValues } from '@/types/types/typesArea';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const getAreas = async (): Promise<Area[]> => {
  const res = await api.get('/areas');
  return res.data?.data || res.data;
};

export const createArea = async (data: AreaFormValues) => {
  await api.post('/areas', data);
};

export const updateArea = async (id: number, data: AreaFormValues) => {
  await api.put(`/areas/${id}`, data);
};

export const deleteArea = async (id: number) => {
  await api.delete(`/areas/${id}`);
};
