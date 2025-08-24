import axiosInstance from './../Api/axios'; 
import { Sede, SedeFormValues } from '@/types/types/Sede';



export const getSedes = async (): Promise<Sede[]> => {
  const res = await axiosInstance.get('/sedes');
  return res.data;
};

export const createSede = async (data: SedeFormValues): Promise<Sede> => {
  const res = await axiosInstance.post('/sedes', data);
  return res.data;
};

export const updateSede = async (id: number, data: SedeFormValues): Promise<Sede> => {
  const res = await axiosInstance.put(`/sedes/${id}`, data);
  return res.data;
};

export const deleteSede = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/sedes/${id}`);
};