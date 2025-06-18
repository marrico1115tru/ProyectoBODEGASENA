import axios from 'axios';
import { Area, AreaFormValues } from '@/types/types/typesArea';

const API_URL = 'http://localhost:3000/areas';

export const getAreas = async (): Promise<Area[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createArea = async (data: AreaFormValues) => {
  await axios.post(API_URL, data);
};

export const updateArea = async (id: number, data: AreaFormValues) => {
  await axios.put(`${API_URL}/${id}`, data);
};

export const deleteArea = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
