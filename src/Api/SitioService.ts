import axios from 'axios';
import { Sitio, SitioFormValues } from '@/types/types/Sitio';

const API_URL = 'http://localhost:3000/sitio';

const config = {
  withCredentials: true,
};

export const getSitios = async (): Promise<Sitio[]> => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const createSitio = async (
  data: SitioFormValues
): Promise<Sitio> => {
  const res = await axios.post(API_URL, data, config);
  return res.data;
};

export const updateSitio = async (
  id: number,
  data: SitioFormValues
): Promise<Sitio> => {
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res.data;
};

export const deleteSitio = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, config);
};
