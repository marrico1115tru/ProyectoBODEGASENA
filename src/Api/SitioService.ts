import axiosInstance from './../Api/axios';
import { Sitio, SitioFormValues } from '@/types/types/Sitio';

export const getSitios = async (): Promise<Sitio[]> => {
  const res = await axiosInstance.get('/sitio');
  return res.data;
};


export const createSitio = async (
  data: SitioFormValues
): Promise<Sitio> => {
  const res = await axiosInstance.post('/sitio', data);
  return res.data;
};


export const updateSitio = async (
  id: number,
  data: SitioFormValues
): Promise<Sitio> => {
  const res = await axiosInstance.put(`/sitio/${id}`, data);
  return res.data;
};


export const deleteSitio = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/sitio/${id}`);
};