// Api/sitioTable.ts
import axios from 'axios';
import { Sitio, SitioFormValues } from '@/types/types/Sitio';

const API_URL = 'http://localhost:3000/sitio';

export const getSitios = async (): Promise<Sitio[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createSitio = async (data: SitioFormValues) => {
  await axios.post(API_URL, data);
};

export const updateSitio = async (id: number, data: SitioFormValues) => {
  await axios.patch(`${API_URL}/${id}`, data);
};

export const deleteSitio = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
